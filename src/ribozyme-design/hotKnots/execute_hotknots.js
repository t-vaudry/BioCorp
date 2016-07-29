var Log = require('./../log/').Log;

var config = require('../config/config.json');
var AlgorithmUtilities = require('../AlgorithmUtilities.js');
var input_file_path = config.env.input_file_path;
var output_file_path = config.env.output_file_path;

//This variable holds how many folds are executing at a time, so that no more than BUFFER_MAX execute simultaneously.
var BufferCount = 0;
var BUFFER_MAX = 2;

function Fold(){}

var HOTKNOTS_CALL_NO_CONSTRAINT = "./HotKnots -noPS -I %SEQUENCEFILE%";
var HOTKNOTS_CALL = "./HotKnots -noPS -c -I %SEQUENCEFILE%";
var QUEUE = new Array();

Fold.ClearBuffer = function ()
{
    if (QUEUE.length != 0)
    {
        Log('*** WARNING: The buffer was not empty!!! Dumping contents of buffer.', 'Fold.ClearBuffer', -1);
        for (var ii = 0; ii < QUEUE.length; ++ii)
        {
            Log(QUEUE[ii][0]/*seq file name is at index 0*/, 'Fold.ClearBuffer', -1);
        }
    }
    QUEUE = new Array();
}


/*Takes in file containing a sequences separated by an endline as well as the output folder.
The reportObject to execute a call-back on and finally, the constraint file if any*/
Fold.HotKnots = function( sequenceFile, reportObj , includeConstraints , callbackArg )
{
	Log('Started folding ' + sequenceFile, 'Fold.HotKnots', 7);
	var sys = require('sys');
	var exec = require('child_process').exec;
	var command = '';
    sequenceFile = sequenceFile.replace(".seq", "");

    if(includeConstraints == null) includeConstraints = false;
	if (!includeConstraints)
	{
		command = HOTKNOTS_CALL_NO_CONSTRAINT
		.replace('%SEQUENCEFILE%',sequenceFile);
	}
	else
	{
	    command = HOTKNOTS_CALL
		.replace('%SEQUENCEFILE%',sequenceFile)
	}
	if (BufferCount < BUFFER_MAX)
	{
	    BufferCount += 1;
        Log('Executing command ' + command, 'Fold.HotKnots', 7);
	    exec(command,
            {
                'timeout' :  4200000 //1h and a bit //3600000//60 min timeout// 1200000 //20 min timeout
            }
            ,
            function CommandExecuteCallback(error, stdout, stderr) {
                BufferCount -= 1;
                if (error !== null) {
                    Log(" **** /BEGIN" + stderr, "HotKnots", 0);
                    Log("Error calling hotknots with " + sequenceFile + "constraints: " + includeConstraints, "ERROR Fold.HotKnots", 0);
                    Log("Command executed: " + command, "HotKnots", 0);
                    Log("Error received: " + error, "HotKnots", 0);
                    Log("\tError Code: " + error.code, "HotKnots", 0);
                    Log("\tError Sig: " + error.signal, "HotKnots", 0);
                    Log("stdout hotknots :"  + stdout, "HotKnots", 3);
                    Log("stderr hotknots :" + stderr, "HotKnots", 0);
                    Log(" **** /END" + stderr, "HotKnots", 0);
                    var request = reportObj.Request; //Using reportObj from parent scope can cause race-condition if context switches. e.g. another request gets here
                    request.ErrorContainer.push(error);
                    if (request.Completed != true) //only on first erroneous callback
                    {
                        request.Completed = true;
                        request.Callback(request);
                    }
                    // if SIGTERM and Error Code == null -> timeout
                    return;
                }

                Log("stdout hotknots :" + command + ": " + stdout, "HotKnots", 3);
                Log("stderr hotknots :" + command + ": " + stderr, "HotKnots", 0);

                reportObj.FileCount = reportObj.FileCount - 1;
                reportObj.ExecuteIfComplete(callbackArg);

                if (QUEUE.length > 0)
                {
                    var args = QUEUE.shift();
                    Fold.HotKnots(args[0], args[1], args[2], args[3]);
                }
            }
        );
	    Log('Completed sending fold ' + sequenceFile, 'Fold.HotKnots', 7);
	}
	else
	{
	    Log('Fold queued, too many folds executing ' + sequenceFile + '. Buffer ' + BufferCount, 'Fold.HotKnots', 4);
	    QUEUE.push([sequenceFile, reportObj, includeConstraints, callbackArg]);
	}
	
}

Fold.ExecuteFolding = function(candidate, constraints, reportObj, target )
{
    if (target == undefined)
        target = false;

    var fs = require('fs');
    AlgorithmUtilities.checkDirectorySync(fs, input_file_path);
    AlgorithmUtilities.checkDirectorySync(fs, output_file_path);
    if (!target)
    {
        Log('Executing fold of candidate ' + candidate.cutsiteID + ':' + candidate.ID, 'Fold.ExecuteFolding', 6);
        var seqFile = input_file_path + '/' + candidate.requestID + '_' + candidate.cutsiteID + '_' + candidate.ID + '.seq';
        fs.writeFileSync(seqFile, candidate.sequence);
        Fold.HotKnots(seqFile, reportObj, false, 1);
        Log('Completed sending fold request of candidate ' + candidate.ID, 'Fold.ExecuteFolding', 6);
    }
    else
    {
        Log('Executing fold of target with open cusite ' + candidate.cutsiteID , 'Fold.ExecuteFolding', 6);
        var seqFile = input_file_path + '/' + candidate.requestID + '_' + candidate.cutsiteID + '_' + candidate.ID + '.seq';
        var constraintStruct = "";
        for(var ii = 0; ii < candidate.sequence.length; ii++){
            var begin = constraints.left;
            var length = constraints.right;
            if(ii >= begin && ii < (begin + length) ) {
                constraintStruct += "x";
            } else {
                constraintStruct += ".";
            }
        }

        fs.writeFileSync(seqFile, candidate.sequence + '\n' + constraintStruct);
        Fold.HotKnots(seqFile, reportObj, true , 3);
        Log('Completed sending fold of target with open cusite ' + candidate.cutsiteID, 'Fold.ExecuteFolding', 6);
    }
}

//	cutSite : Id info
//		ID : Id of the cutsite
//		requestID : Id of the request
//  candidateArray : array of candidates to fold
//  reportObj : Master object that sees it all

Fold.FoldCandidates = function ( cutSite , candidateArray, reportObj)
{
	Log('Folding request being sent for candidates for cutSite ' + cutSite.ID, 'Fold.FoldCandidates',5);
	reportObj.AddToExecutionCount (candidateArray.length );
	for(var ii = 0; ii < candidateArray.length ; ++ii )
	{
		Fold.ExecuteFolding({'ID' :candidateArray[ii].ID,
            'cutsiteID': cutSite.ID,
            'requestID': cutSite.requestID,
            'sequence':candidateArray[ii].Sequence },
            '',
            reportObj
        );
	}
	Log('Finished Folding request being sent for candidates for cutSite ' + cutSite.ID, 'Fold.FoldCandidates', 5);
}

exports.Fold = Fold;

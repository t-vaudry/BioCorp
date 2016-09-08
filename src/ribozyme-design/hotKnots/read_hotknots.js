var Model = require('../model/');
var Candidate = Model.DomainObjects.Candidate;
var StructureInfo = Model.DomainObjects.StructureInfo;
var Log = require('./../log/').Log;
var config = require('../config/config.json');
var input_file_path = config.env.input_file_path;
var output_file_path = config.env.output_file_path;
var AlgorithmUtilities = require('../AlgorithmUtilities.js');

function RemoveAllValuesFromArray(arr,val)
{
	var index = arr.indexOf(val);
	while(index != -1)
	{
		arr.splice(index, 1);
		index = arr.indexOf(val);
	}
}

function ParseUtilities(){}

// Parses the summary of the structures that contains 
// minimum free energy and max free energy, and frequency.
// Returns an array of StructureInfo containing the data
// Generally 10structure_2.out
ParseUtilities.ParseStructures=
function(file)
{
    var fs = require('fs');
	var StructureInfos = new Array();
	var data = fs.readFileSync(file, 'ascii');

	var structsSplit = data.split('ENERGY');
	var lowestFreeEnergy;
	for (var jj = 1; jj < structsSplit.length; ++jj)//1 since first split (before ENERGY) is empty
	{
	    var splited = structsSplit[jj].split('\n');
		var lowestFreeEnergy = splited[0].split(' ')[2];
		var structInfo = new StructureInfo(null,null,null,parseFloat(lowestFreeEnergy));
	    //First line is a header
	    //node breakdown [0]=positon,[1]=nucleotide base, [2],[3]=prev,next, [4]=connected-to, [5]=node
	    for (var ii = 1; ii < (splited.length - 1) ; ++ii) //1 due to the first line which labels the structure, -1 due to empty line at eof
	    {
	        var node = splited[ii].split(' ');
	        RemoveAllValuesFromArray(node, '');//remove all empty entries
	        //Skip non-connection strings
	        if (node.length != 6)
	            continue;
	        var connectsTo = parseInt(node[4])
	        if (connectsTo != 0) { //If the value is zero, it is not connected to anything
	            structInfo.AddPair(parseInt(node[0]), connectsTo, node[1]);
	        } else {
	            structInfo.AddPair(parseInt(node[0]), -1, node[1])
	        }
	    }
		StructureInfos.push(structInfo);
	}

	return StructureInfos;
}

// Summarizes the hotknots results into an array of candidates
// for a given cutsite.
ParseUtilities.ParseSFoldResults = function (requestId, cutsiteID) {

    Log(" ******************* Begun parsing HOTKNOTS results ******************* ", "ParseUtilities.ParseSFoldResults",0);
    if (requestId == undefined)
        requestId = '';

    var file_pattern_begin = output_file_path + '/' + requestId + '_' + cutsiteID + '_';
    fs = require('fs');
    var Candidates = new Array();
    for (var struct_num = 0; struct_num < 200; struct_num++) 
    {

        Log("Parsing " + cutsiteID + ':'+ struct_num + "th candidate ");
        var file = file_pattern_begin + (struct_num).toString() + "_DP.ct";
        if (!fs.existsSync(file)) {
            Log("No more files for cutsite type " + cutsiteID + ", request " + requestId, "ParseUtilities.ParseSFoldResults", 1);
            break; //ran out of files
        }
        var Structs = ParseUtilities.ParseStructures(file);
        Candidates.push(Structs);
    }
	AlgorithmUtilities.deleteFiles(input_file_path + '/' + requestId + '_' + cutsiteID + '_' + '*.seq');
	AlgorithmUtilities.deleteFiles(file_pattern_begin + '*.bpseq');
	AlgorithmUtilities.deleteFiles(file_pattern_begin + '*.ct');
    return Candidates;
}
	
exports.ParseUtilities=ParseUtilities;

var fs = require('fs'),
    mongoose = require('mongoose'),
    mkdirp = require('mkdirp'),
    rimraf = require('rimraf'),
    async = require('async'),
    path = require('path');

var Request = mongoose.model('Request');

exports = module.exports = utils = {};

function toTargetRegion(region){
    switch(region){
    case "ORF":
	return 4;
    case "5\'":
	return 5;
    case "3\'":
	return 3;
    }
}

utils.rmDirIfExists = function(pathToDir){
    rimraf.sync(pathToDir);
};

utils.emptyDb = function(callback){
    Request.find({}, function(err, requests){
	if(err)
	    callback("Error cleaning database "+err );
	else {
	    for(var i = 0; i < requests.length; ++i)
	    {
		requests[i].remove(function(err){
		    if(err)
			callback("Error cleaning database "+err);
		});
	    }
	    setTimeout(callback, 1000);
	}
    });
};

utils.createRequest = function(id, test_data, callback){
    var req = Request.createRequest(id,
				    test_data.sequence,
				    '',
				    test_data.foldShape,
				    test_data.temperature,
				    test_data.naC,
				    test_data.mgC,
				    test_data.oligoC,
				    test_data.cutsites,
				    toTargetRegion(test_data.region),
				    test_data.env.type,
				    test_data.env.target,
				    test_data.left_arm_min,
				    test_data.right_arm_min,
				    test_data.left_arm_max,
				    test_data.right_arm_max,
				    test_data.promoter,
				    test_data.specificity,
				    'ribosoft.mailer@gmail.com',
				    test_data.organization
				   );
    callback(null, req);
}

utils.saveRequest = function(request, callback){
    request.save(function(err, request){
	if(err)	{
	    callback(err);
	}
	else{
	    callback(null, request);
	}
    });
};

utils.createPendingRequest = function(id, requestData, callback){
    async.waterfall(
	[
	    function(callback){
		callback(null, id, requestData);
	    },
	    utils.createRequest,
	    utils.saveRequest	    
	],
	function(err, result){
	    if(err){
		callback(err);
	    }
	    else {
		callback(null, result.uuid);
	    }
	});
};

utils.setRequestFinished = function(request, results_data, callback){
    request.setStatus(3);
    request.setStatus(4);
    try{
	saveResultsUncompressed(request.uuid, JSON.stringify(results_data));
	request.save(function(err, result){
	    if(err) callback(err);
	    else {
		callback(null, result);
	    }
	});
    } catch (err){
	callback(err);
    }
};

utils.setRequestBlocked = function(request, results_data, callback){
    request.setStatus(3);
    request.setRemainingTime({remainingDuration: 0, unit:'min'});
    try{
	request.save(function(err, result){
	    if(err) callback(err);
	    else {
		callback(null, result);
	    }
	});
    } catch (err){
	callback(err);
    }
};


var pathToResults = path.join(process.cwd(), 'requests');
function saveResultsUncompressed(id, results){
    mkdirp.sync(path.join(pathToResults, id));
    fs.writeFileSync(path.join(pathToResults, id, 'requestStateUncompressed.json') , results, 'utf-8');
};

function loadResultsUncompressed(id){
    return fs.readFileSync(path.join(pathToResults, id, 'requestStateUncompressed.json'), 'utf-8'); 
};

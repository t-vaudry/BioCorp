var scheduler = require('./lib/scheduler/'),
    queryer = require('./lib/queryer/'),
    async = require('async'),
    mailer = require('./lib/mailer/'),
    config = require('./config/'),
    util = require('util');

var intervalTimeout = 15 * 1000 * 60; //Every 15 mins

var app = {};

app.launchPendingRequests = function(callback){
    async.waterfall([
	queryer.getCountPendingRequests,
	executeNext(queryer.getNextRequest),
	scheduler.startProcessingRequest
    ], function(err, requestId, timeoutInterval){
	if(err)
	    callback(new Error("Error "+err+" while launching pending requests."));
	else if(!requestId) 
	    callback(null, "No pending requests exist");
	else {
	    callback(null, "Request "+requestId+" launched");
	}
    });
}

app.notifyFinishedRequests = function(callback){
    async.waterfall([
	queryer.getCountFinishedRequests,
	executeNext(queryer.getFinishedRequests),
	mailer.notifyOwners
    ], function(err, numberNotified){
	if(err)
	    callback(new Error("Errors "+err+" while notifying owners" ), 0);
	else
	    callback(null, numberNotified);
    });
}

app.handleRunningRequests = function(callback){
    async.waterfall([
	queryer.getRunningRequest,
	queryer.updateRunningRequestDuration,
	queryer.stopBlockedRequest,
	mailer.notifyOwnerRequestFailed
    ], function(err, result){
	if(err){
	    if(err.message == "No running request")
		callback(null, "No running request");
	    else
		callback(new Error("Error "+err.message+" while updating running request" ));
	} else if (result) {
	    callback(null, "Result of running request "+result);
	} else {
	    callback(null);
	}
    });
};

app.collectAnalytics = function(callback){
    async.waterfall([
	queryer.getListOrganizations,
	mailer.notifyAdmin
    ], function(err, result){
	if(err){
	    callback(err);
	} else {
	    console.log( "List of "+result+" organization names was sent" );
	    if(callback) {
	    	callback(null, result);
	    }
	}
    });
}

function collectMemoryUsage(){
    console.log( "Memory Usage", util.inspect(process.memoryUsage()) );
};


var executeNext = function(next){
     return function(count, callback){
	if(count > 0)
	    next(callback);
	else{
	    callback(null, '');
	}
    };
};

var executeScript = function(){
    async.waterfall(
	[
	    app.handleRunningRequests,
	    function(result, callback){
		if(result)
		    console.log( result );
		callback(null);
	    },
	    queryer.getCountRunningRequests,
	    function(count, callback) {
		if(count <= 0)
		    callback(null);
		else {
		    callback(new Error("There is still one request running"));
		}
	    },
	    app.launchPendingRequests,
	    function(result, callback){
		console.log( result );
		callback(null);
	    },
	    app.notifyFinishedRequests,
	    function(count, callback){
		if(count)
		    console.log( "Successfully Notified "+count+" requests"  );
		else
		    console.log( "No requests to be notified" );
		callback(null);
	    }
	],
	function(err){
	    if(err)
		console.log( "Process failed because of "+err );
	    console.log( "Executor finished. Rescheduling in "+(intervalTimeout/(60 * 1000))+" minutes");
	    setTimeout(executeScript, intervalTimeout);
	});
};

process.on('uncaughtException', function(err) {
    if(config.reporter)
	mailer.notifyErrors(err.stack,function(){});
});


if (module !== require.main) {
    module.exports = exports = app;
} else {
    executeScript();
    setInterval(app.collectAnalytics, 1000 * 60 * 60 * 24 * 7); //every week
}

var should = require('should'),
    async = require('async'),
    fs = require('fs'),
    app = require('../index.js'),
    mongoose = require('mongoose'),
    test_data = require('./test_data.js'),
    test_utils = require('./test_utils.js');

var testID = 'Tes1';
var pathToDir = process.cwd()+'/'+testID;

beforeEach(function(done){
    test_utils.rmDirIfExists(pathToDir);
    done();
});

describe('Notifying finished requests', function(){
    this.timeout(5 * 1000); //times out at 5 seconds
    before(function(done){
	test_utils.emptyDb(done);
    });
	
    it('No notification if no request finished', function(done){
	app.notifyFinishedRequests(function(err, count){
	    if(err){
		done(err);
	    } else {
		count.should.eql(0);
		done();
	    }
	});
    });

    it('Finished request causes notification to be sent', function(done){
	var requestData = test_data.longSequence.request;
	var resultsData = test_data.longSequence.results;
	async.waterfall(
	    [
		function(callback){
		    callback(null, testID, requestData);
		},
		test_utils.createRequest,
		test_utils.saveRequest,
		function(request, callback){
		    callback(null, request, resultsData);
		},
		test_utils.setRequestFinished,
		function(request, callback){
		    app.notifyFinishedRequests(callback);
		}
	    ],
	    function(err, count){
		if(err){
		    done(err);
		}
		else {
		    count.should.eql(1);
		    done();
		} 
	    });
    });
});


describe('Notifying blocked requests', function(){
    this.timeout(10 * 1000); //times out at 10 seconds
    before(function(done){
	test_utils.emptyDb(done);
    });
	
    it('No notification if no request is blocked', function(done){
	app.handleRunningRequests(function(err, result){
	    if(err){
		done(err);
	    } else {
		result.should.include("No running request");
		done();
	    }
	});
    });


    it('Blocked request causes notification to be sent', function(done){
	var requestData = test_data.longSequence.request;
	var resultsData = test_data.longSequence.results;
	async.waterfall(
	    [
		function(callback){
		    callback(null, testID, requestData);
		},
		test_utils.createRequest,
		test_utils.saveRequest,
		function(request, callback){
		    callback(null, request, resultsData);
		},
		test_utils.setRequestBlocked,
		function(request, callback){
		    app.handleRunningRequests(callback);
		}
	    ],
	    function(err, result){
		done(err);
	    });
    });
});


describe('Collecting analytics', function(){
    this.timeout(10 * 1000); //times out at 10 seconds
    before(function(done){
	test_utils.emptyDb(done);
    });
	
    it('Notify admin with list of organizations', function(done){
	var request1 = test_data.multipleRequests.request1;
	var request2 = test_data.multipleRequests.request2;
	var request3 = test_data.multipleRequests.request2;
	async.waterfall(
	    [
		function(callback){
		    callback(null, '1234', request1);
		},
		test_utils.createRequest,
		test_utils.saveRequest,
		function(request, callback){
		    callback(null, '4321', request2);
		},
		test_utils.createRequest,
		test_utils.saveRequest,
		function(request, callback){
		    callback(null, '5678', request3);
		},
		test_utils.createRequest,
		test_utils.saveRequest,
		function(request, callback){
		    callback(null);
		},
		app.collectAnalytics
	    ],function(err, count){
		if(err){
		    done(err);
		} else {
		    count.should.equal(2);
		    done();
		}
	    });
    });

});

// Always keep last
after(function(done){
    test_utils.rmDirIfExists(pathToDir);
    done();
});

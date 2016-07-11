var config = require('../../config/'),
    mongoose = require('mongoose'),
    request = require('../../models/request.js');

var connection = mongoose.connect( config.dbUrl );

var Request = mongoose.model('Request');

exports = module.exports = queryer = {};

queryer.getCountPendingRequests = function(callback){
    getCountQueriedRequests({status: 2}, callback);
}

queryer.getCountFinishedRequests = function(callback){
    getCountQueriedRequests({status: 4}, callback);
}

queryer.getCountRunningRequests = function(callback){
    getCountQueriedRequests({status: 3}, callback);
};

queryer.getRunningRequest = function(callback){
    Request.findOne({status: 3}).exec(function(err, request){
	if(err){
	    callback(err);
	}
	else if(!request){
	    callback(new Error("No running request"));
	}
	else{
	    callback(null, request);
	}
    });    
};


queryer.updateRunningRequestDuration = function(request, callback){
    var duration = request.getRemainingTime('min').remainingDuration;
    duration = Math.max(duration-15, 0);
    request.setRemainingTime({ unit: 'min', remainingDuration : duration });
    request.save(function(err, req){
	if(err)
	    callback("Could not update request duration because "+err);
	else {
	    callback(null, req);
	}
    });
};


queryer.stopBlockedRequest = function(request, callback){
    var req = request;
    var duration = request.getRemainingTime('min').remainingDuration;
    if(duration <= 0){
	request.remove(function(err){
	    if(err)
		callback(new Error("Error "+err+" while trying to delete blocked request"));
	    else {
		callback(null, req);
	    }
	});
    } else {
	callback(null, null);
    }
};


queryer.getNextRequest = function(callback){
    Request.find({status: 2}).sort({createDate: 'asc'}).exec(function(err, requests){
	if(err)
	    callback(err);
	else
	    callback(null, requests[0]);
    });
};

queryer.getFinishedRequests = function(callback){
    Request.find({status: 4}).sort({createDate: 'asc'}).exec(function(err, requests){
	if(err){
	    callback(err);
	}
	else{
	    callback(null, requests);
	}
    });
}

queryer.getListOrganizations = function(callback){
    var now =  new Date();
    var weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    Request.find({"createDate":
		  {
		      "$gte": weekAgo,
		      "$lt": now
		  }
		 }).select('organization').exec(function(err, requests){
	if(err){
	    callback(err);
	}
	else{
	    var list = [];
	    requests.forEach(function(request){
		var found = false;
		for(var i = 0; (i < list.length) && !found; ++i){
		    if(list[i] == request.organization){
			found = true;
		    }
		}
		if(!found)
		    list.push(request.organization);
	    });
	    callback(null, list);
	}
    });    
}

function getCountQueriedRequests(query, callback){
    Request.count(query, function(err, count){
	if(err)
	    callback(err);
	else
	    callback(null, count);
    });
}


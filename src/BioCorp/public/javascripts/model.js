var indexUrl = window.location.href.indexOf("client_tests");
var testMode = (indexUrl !== -1);
if(testMode){
    var urlLocation =  window.location.href.substr(0, indexUrl) + 'ribosoft/';
    var testEmailUser = "test@test.test";
}

function Env(type, target){
    //type is either "vivo" or "vitro"
    this.type = type;
    this.target = target;
}

function Request(
    seq,
    accessionNumber,
    tempEnv,
    naEnv,
    mgEnv,
    oligoEnv,
    cutsites,
    targetRegion,
    targetEnv,
    vivoEnv,
    ribozymeSelection,
    left_arm_min,
    right_arm_min,
    left_arm_max,
    right_arm_max,
    promoter,
    emailUser){
    this.id = '';
    this.sequence = seq;
    this.accessionNumber = accessionNumber;
    this.temperature = tempEnv;
    this.naC = naEnv;
    this.mgC = mgEnv;
    this.oligoC = oligoEnv;
    this.cutsites = cutsites;
    this.ribozymeSelection = ribozymeSelection;
    this.left_arm_min = left_arm_min;
    this.right_arm_min = right_arm_min;
    this.left_arm_max = left_arm_max;
    this.right_arm_max = right_arm_max;
    this.env = targetEnv? new Env(targetEnv, vivoEnv) : undefined;
    this.region = targetRegion;
    this.promoter = (promoter == "yes") ? 1 : 0;
    this.emailUser = testEmailUser || emailUser;
}

Request.prototype.submitRequest = function(callback){
    var data = JSON.stringify(this);
    var url = window.location.href.substr(0, window.location.href.indexOf("#"));
    console.log("URL after submitRequest call is " + url);
    $.ajax({
        type: "POST",
        url: (urlLocation || url)+"requests/",
        data: data,
	    contentType: "application/json; charset=utf-8",
        success: function(data, status, xhr) {
	        callback(null, xhr.getResponseHeader("Location"));
        },
        error: function(jqXHR, textStatus, errorThrown) {
    	    Request.handleError(jqXHR, "Submitting request", callback);
        }
    });
};

Request.prototype.updateRequest = function(callback){
    var data = JSON.stringify(this);
    var url = window.location.href.replace('processing', 'requests');
    $.ajax({
        type: "PUT",
        url: (urlLocation || url),
        data: data,
	    contentType: "application/json; charset=utf-8",
        success: function(data, status, xhr) {
	    callback(null, data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
	    Request.handleError(jqXHR, "Updating request", callback);
        }
    });
};

Request.getRequest = function(callback){
    url = window.location.href.replace('processing' , 'requests');
    $.ajax({
        type: "GET",
        url: url,
        data: {},
	    contentType: "application/json; charset=utf-8",
        success: function(data, status, xhr) {
	    var response = data.request;
	    var request = new Request(
		response.sequence,
		response.accessionNumber,
		response.temperature,
		response.naC,
		response.mgC,
		response.oligoC,
		response.cutsites,
		response.region,
		response.env.type,
		response.env.target,
        response.ribozymeSelection,
		response.left_arm_min,
		response.right_arm_min,
		response.left_arm_max,
		response.right_arm_max,
		(response.promoter)? "yes" : "",
		response.emailUser
	    );
	    callback(null, request);
        },
        error: function(jqXHR, textStatus, errorThrown) {
	    Request.handleError(jqXHR, "Getting request information", callback);
        }
    });
}

Request.prototype.getRequestStatus = function(callback){
    $.ajax({
        type: "GET",
        url : window.location.href.replace('processing','requests') + '/status',
        data : {extraInfo: 'true'},
        success : function(data) {
	    callback(null, data);
        },
        dataType : "json",
	    contentType: "application/json; charset=utf-8",
        error : function(jqXHR, textStatus, errorThrown) {
	    Request.handleError(jqXHR, "Getting request information", callback);
        }
    });
};


Request.prototype.extractData = function(obj){
    for(var d = 0; d < obj.length; ++d){
	this[obj[d].name] = obj[d].value;
    }

    var cutsites = [];
    for(var i = 0; i < obj.length; ++i) {
	if(obj[i].name == "cutsites")
	    cutsites.push(obj[i].value);
    }
    this.cutsites = cutsites;

    var region = [];
    for(var f = 0; f < obj.length; ++f)
	if(obj[f].name == 'region')
	    region.push(obj[f].value);
    this.region = region;

    this.promoter = parseInt(this.promoter) == 1;

    if(this.env){
	var tmp = this.env;
	delete this.env;

	this.env = new Env(tmp, tmp =="vivo" ? this.envVivo: "");
        if(this.env.target == "other"){
            this.env.target = this.otherEnv;
            delete this.otherEnv;
        }
    }
    delete this.envVivo;
};


Request.handleError = function(jqXHR, action, callback){
    if(jqXHR.status == 400 || jqXHR.status == 405) {
	var error = JSON.parse(jqXHR.responseText);
	callback(new Error(action+" failed because "+error.error));
    } else if (jqXHR.status == 404) {
	callback(new Error(action+" failed because the request could not be found."));
    } else {
	callback(new Error(action+" failed because the service is currently unavailable. Please try again later"));
    }
};

var request = require('request');

function generateUID(){
  return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).substr(-4);
}

function fromObjectToArrayString(obj){
  return function(){
    var arr = new Array();
    for(var i = 0, l = ojb.length; i<l; ++i){
      arr.push(obj[i]);
    }
    return arr;
  }();
}

function fromObjectToArrayStringUpper(obj){
  return function(){
    var arr = new Array();
    for(var i = 0, l = obj.length; i<l; ++i){
      console.log("obj[i].toUpper " + obj[i].toUpperCase());
      arr.push(obj[i].toUpperCase());
    }
    return arr;
  }();
}

function renderInputError(clientMessage, next){
  renderError(clientMessage, "This should have been handled on client side", next);
};

function renderDatabaseError(clientMessage, next){
  renderError(clientMessage, "Something went wrong when interacting with the database", next);
};

function renderError(clientMessage, consoleMessage, next){
  next({
    errorMessage: clientMessage
  });
};

function onSaveHandler(successCallback, next){
  return function(err, result){
    if(err){
      renderDatabaseError("Could not update process request", next);
    } else if(successCallback){
      successCallback(result);
    }
  };
};

function toTargetRegion(region){
  var sum = 0;
  for(var i = 0; i < region.length; ++i){
    switch(region[i]){
      case "ORF":
        sum += 4;
        break;
      case "5/'":
        sum += 5;
        break;
      case "3/'":
        sum += 3;
        break;
    }
  }
  return sum;
}

function returnError(statusCode, errorMessage, next){
  next({
    statusCode: statusCode,
    errorMessage: errorMessage
  });
}

function returnInternalError(err, next){
  return returnError(500, JSON.stringify(err), next);
}

exports.generateUID = generateUID;
exports.objectToArrayString = fromObjectToArrayString;
exports.objectToArrayStringUpper = fromObjectToArrayStringUpper;
exports.renderInputError = renderInputError;
exports.renderDatabaseError = renderDatabaseError;
exports.onSaveHandler = onSaveHandler;
exports.toTargetRegion = toTargetRegion;
exports.returnError = returnError;
exports.returnInternalError = returnInternalError;

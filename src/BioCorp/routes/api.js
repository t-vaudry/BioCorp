var utils = require('./route_utils'),
    mongoose = require('mongoose'),
    request = require('request'),
    async = require('async');

var Request = mongoose.model('Request');

module.exports = {
  createRequest : function(req, res, next){
    fetchAccession(req.body.sequence, req.body.accessionNumber,
    function(seq, number){
      if(!seq){
        utils.returnError(400, "No sequence was submitted.", next);
      } else if (!req.body.cutsites || req.body.cutsites.length > 2) {
        utils.returnError(400, "Submitting too many cutsites. No more than two cutsites can be used.", next);
      } else if((parseInt(req.body.left_arm_max) > 34) || (parseInt(req.body.right_arm_max)) > 34) {
        utils.returnError(400, "Helixes I and III cannot be longer than 34 nucleotides long", next);
      } else {
        var id = utils.generateUID();
        var vivoEnv = (req.body.env.type === "vivo") ? req.body.env.target: '';

        if(req.body.region)
        var region = utils.toTargetRegion(req.body.region);

        Request.createRequest(id,
                seq,
                number,
                req.body.foldShape,
                parseInt(req.body.temperature),
                parseInt(req.body.naC),
                parseInt(req.body.mgC),
                parseInt(req.body.oligoC),
                req.body.cutsites,
                region,
                (req.body.env.type === "vivo"),
                vivoEnv,
                req.body.ribozymeSelection,
                parseInt(req.body.left_arm_min),
                parseInt(req.body.right_arm_min),
                parseInt(req.body.left_arm_max),
                parseInt(req.body.right_arm_max),
                req.body.promoter,
                req.body.specificity,
                req.body.emailUser,
                req.body.organization).save(function(err, result){
                  if(err){
                    utils.returnInternalError(err, next);
                  } else{
                    res.location(req.protocol + "://" + req.get('Host') +
                    req.url + id);
                    res.status(201);
                    res.end();
                  }
                });
      }
    }, next);
  },

  getRequest : function(req, res, next){
    var uuid = req.params.id;
    console.log("UUID = " + uuid);
    Request.findOne({uuid: uuid}, function(err, result){
      if(err){
        utils.returnInternalError(err, next);
      } else if(!result){
        utils.returnError(404, "The request with id " + uuid + " does not exist", next);
      } else {
        sendRequestResponse(res, result);
      }
    });
  },

  deleteRequest : function(req, res, next){
    var uuid = req.params.id;
    async.waterfall(
      [
        function(callback){
          callback(null, {uuid: uuid});
        },
        function(query, callback){
          Request.findOne(query, callback);
        }
      ],
        function(err, result){
          if(err){
            utils.returnInternalError(err, next);
          } else if(!result){
            utils.returnError(404, "The request with id " + uuid + " does not exist.", next);
          } else if(result.getDetailedStatus() == "In-Processing"){
            utils.returnError(405, "The request is currently being processed. It cannot be deleted anymore", next);
          } else{
            result.remove();
            res.send(204);
          }
        });
  },

  getRequestStatus : function(req, res, next){
    var uuid = req.params.id;
    var extraInfo = req.query.extraInfo;
    async.waterfall(
      [
        function(callback){
          callback(null, {uuid: uuid});
        },
        function(query, callback){
          Request.findOne(query, callback);
        }
      ], function(err, result){
        if(err){
          utils.returnInternalError(err, next);
        } else if(!result){
          utils.returnError(404, "The request with id " + uuid + " does not exist.", next);
        } else {
          var returnData = {
            duration: result.getRemainingTime('min'),
            status: result.getDetailedStatus()
          };
          var status = 202;

          if(result.getDetailedStatus() === "Processed"){
            var location = req.url.split('/status')[0] + '/results';
            res.location(req.protocol + "://"+ req.get('Host') + location);
            status = 200;
          }

          if(extraInfo){
            returnData.state = result.getState();
          }

          res.json(status, returnData);
        }
      });
  },

  getResults : function(req, res, next){
    var uuid = req.params.id;
    async.waterfall(
      [
        function(callback){
          callback(null, {uuid:uuid});
        },
        function(query, callback){
          Request.findOne(query, callback);
        }
      ], function(err, result){
        if(err){
          utils.returnInternalError(err, next);
        } else if(!result){
          utils.returnError(404, "The request with id " + uuid + " does not exist.", next);
        } else{
          switch(result.getDetailedStatus()){
            case "In-Processing":
              res.json(202, result.getRemainingTime('min'));
              break;
            case "Ready for processing":
            default:
              res.send(202);
              break;
            case "Processed":
              try{
                var results = require(result.resultPath);
                res.json(200, {'results': results});
              } catch(err){
                res.json(204, {'results': {}});
              }
              break;
            case "Created":
              res.send(404);
              break;
          }
        }
      });
  },

  updateRequest : function(req, res, next){
    var uuid = req.params.id;
    async.waterfall(
      [
        function(callback){
          callback(null, {uuid:uuid});
        },
        function(query, callback){
          Request.findOne(query, callback);
        }
      ], function(err, result){
        if(err){
          utils.returnInternalError(err, next);
        } else if(!result){
          utils.returnError(404, "The request with id " + uuid + " does not exist.", next);
        } else{
          var status = result.getDetailedStatus();
          if(status == "Processed"){
            utils.returnError(405, "The request with id " + uuid + " cannot be modified; it has already been processed", next);
          } else if(status == "In-Processing"){
            utils.returnError(405, "The request with id " + uuid + " cannot be modified; it is currently being processed", next);
          } else {
            fetchAccession(req.body.sequence,
                        req.body.accessionNumber,
                        function(seq, number){
                          if(!seq){
                            utils.returnError(400, "No sequence was submitted.", next);
                          } else if(!req.body.cutsites || req.body.cutsites.length > 2) {
                            utils.returnError(400, "Submitting too many cutsites. No more than two cutsites can be used.", next);
                          } else{
                            var vivoEnv = (req.body.env.type === "vivo") ? req.body.env.target : '';
                            var region = utils.toTargetRegion(req.body.region);
                            result.sequence = seq;
                            result.accessionNumber = number;
                            result.foldShape = req.body.foldShape;
                            result.tempEnv = parseInt(req.body.temperature);
                            result.naEnv = parseInt(req.body.naC);
                            result.mgEnv = parseInt(req.body.mgC);
                            result.oligoEnv = parseInt(req.body.oligoC);
                            result.cutsites = req.body.cutsites;
                            result.targetRegion = region;
                            result.targetEnv = (req.body.env.type === "vivo");
                            result.vivoEnv = vivoEnv;
                            result.emailUser = req.body.emailUser;
                            result.ribozymeSelection = req.body.ribozymeSelection;
                            result.left_arm_min = parseInt(req.body.left_arm_min);
                            result.right_arm_min = parseInt(req.body.right_arm_min);
                            result.left_arm_max = parseInt(req.body.left_arm_max);
                            result.right_arm_max = parseInt(req.body.right_arm_max);
                            result.save(function(err, result){
                              if(err){
                                utils.returnInternalError(err, next);
                              } else{
                                sendRequestResponse(res, result);
                              }
                            });
                          }
                        }, next);
          }
        }
      });
  }
};

function fetchAccessionAjax(accession, successCallback, errorCallback){
  request({
    uri: "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id="+accession+"&rettype=fasta&retmode=text",
    method: "GET",
    followRedirect : false
  }, function(err, res, body){
    if(!err && res.statusCode == 200){
      var seq = body.split('\n');
      seq.shift();
      successCallback(seq.join(""));
    } else{
      errorCallback(err);
    }
  });
};

function fetchAccession(sequence, accessionNumber, callback, next){
  if(!sequence && !accessionNumber){
    utils.returnError(400, "No sequence was submitted.", next);
  } else if(!sequence && accessionNumber){
    fetchAccessionAjax(accessionNumber, function(seq){
      callback(seq, accessionNumber);
    }, function(error){
      utils.returnError(400, "Accession Number is invalid.", next);
      accessionNumber = '';
    });
  } else{
    callback(sequence, accessionNumber);
  }
};

function sendRequestResponse(res, result){
  var response = {
    id: result.uuid,
    sequence: result.sequence,
    foldShape: result.foldShape,
    temperature: result.tempEnv,
    naC: result.naEnv,
    mgC: result.mgEnv,
    oligoC: result.oligoEnv,
    cutsites: result.cutsites,
    region: result.getRegion(),
    env: result.getEnv(),
    ribozymeSelection: ribozymeSelection,
    left_arm_min: result.left_arm_min,
    right_arm_min: result.right_arm_min,
    left_arm_max: result.left_arm_max,
    right_arm_max: result.right_arm_max,
    emailUser: result.emailUser,
    organization: result.organization,
    promoter: result.promoter,
    specificity: result.specificity
  };

  if(result.accessionNumber){
    response.accessionNumber = result.accessionNumber;
  }

  //res.json(200, {'request': response});
  res.status(200).json({'request': response});
}

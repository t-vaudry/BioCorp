var express = require('express');
var router = express.Router();
var utils = require('./route_utils');
var config = require('../config/');
var url = require('url');
var mongoose = require('mongoose');
var Request = mongoose.model('Request');
var RibozymeConfigXML = require('../../ribozyme-design/XMLReader/').RibozymeConfigXML;

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'BioCorp' });
});

router.get('/ribozyme', function(req, res, next){
  //Read list of ribozymes from XML configuration file
  var config = new RibozymeConfigXML('../ribozyme-design/config/ribozyme.xml');
  config.getConfigXML();
  var ribozymeList = config.getRibozymeList();
  var ribozymeHelixSizes = config.getRibozymeHelixSizes();
  res.render('./designSteps/ribozyme',
    { title: 'Design with Ribozyme',
      ribozymeList: ribozymeList,
      ribozymeHelixSizes: ribozymeHelixSizes });
});

router.get('/index', function(req, res, next){
  res.render('index', {title: 'BioCorp'});
});

router.get('/license', function(req, res, next){
  res.render('license', {title: 'License'});
});

router.get('/oligoOrder', function(req, res, next){
  res.render('./designSteps/oligoOrder', { title: 'Order Your Oligoo'});
});

router.get('/processing/:id', function(req, res, next){
  res.render('processing_page', {title: 'Ribozoft - Processing'});
});

router.get('/results/:id', function(req, res, next){
  var path = require('path').join(config.home_folder, req.params.id, '/requestState.json');

  var json_output = '', resultMessage = '';
  try {
    json_output = require(path);
  } catch(error){
    resultMessage = 'No candidates that meet the Annealing Temperature constraints could be generated. This is generally addressed by adjusting the arm lengths edges to be longer.';
  }

  Request.findOne({uuid: req.params.id}, function(err, request){
    var obj = {
      title: 'Ribozoft - Results',
      stepTitle: 'Ribozyme Design Results',
      results: json_output,
      resultMessage: resultMessage,
      input: {}
    };

    if(err){
      res.render('results_page', obj);
    } else if(!request){
      res.redirect('/error');
    } else{
      obj.input = {
        sequence: request.sequence,
        accessionNumber: request.accessionNumber,
        foldShape: request.foldShape,
        tempEnv: request.tempEnv,
        naEnv: request.naEnv,
        mgEnv: request.mgEnv,
        oligoEnv: request.oligoEnv,
        cutsites: request.cutsites.join(", "),
        promoter: (request.promoter ? "Yes" : "No"),
        ribozymeSelection: request.ribozymeSelection,
        left_arm_min: request.left_arm_min,
        right_arm_min: request.right_arm_min,
        left_arm_max: request.left_arm_max,
        right_arm_max: request.right_arm_max,
        targetRegion: request.getRegion().join(", "),
        targetEnv: "In-" + request.getTargetEnv(),
        vivoEnv: request.getEnv().target,
        specificity: (request.specificity == "cleavage")? "Cleavage only" : "Cleavage and Hybridization"
      };
      res.render('results_page', obj);
    };
  });
});


/*
exports.license = function(req, res){
  res.render('license', {
    title: 'License'
  });
};

exports.index = function(req, res){
  res.render('index', {
    title: 'BioCorp'
  });
};

exports.step0 = function(req, res){
  res.render('./designSteps/serviceselect', {
    title: 'Service Selection'
  });
};

exports.ribozyme = function(req, res){
  res.render('./designSteps/ribozyme', {
    title: 'Design with Ribozyme'
  });
};
*/

module.exports = router;

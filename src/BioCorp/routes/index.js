var express = require('express');
var router = express.Router();
var utils = require('./route_utils');
var config = require('../config/');
var url = require('url');
var mongoose = require('mongoose');
var Request = mongoose.model('Request');
var config_xml_path = require('../../ribozyme-design/config/config.json').env.config_xml_path;
var RibozymeConfigXML = require('../../ribozyme-design/XMLReader/').RibozymeConfigXML;
var appConfigXML = new RibozymeConfigXML(config_xml_path);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'bioCorp' });
});

router.get('/ribozyme', function(req, res, next){
  appConfigXML.getConfigXML();
  var ribozymeList = appConfigXML.getRibozymeList('Rz');
  var ribozymeHelixSizes = appConfigXML.getRibozymeHelixSizes();
  var cutsiteList = appConfigXML.getCutsiteList();
  res.render('./designSteps/ribozyme',
    { title: 'design_with_ribozyme',
      ribozymeList: ribozymeList,
      ribozymeHelixSizes: ribozymeHelixSizes,
      cutsiteList: cutsiteList });
});

router.get('/crispr', function(req, res, next){
  res.render('./crispr/crispr',
    { title: 'design_crispr'});
});

router.get('/index', function(req, res, next){
  res.render('index', {title: 'bioCorp'});
});

router.get('/license', function(req, res, next){
  res.render('license', {title: 'license'});
});

router.get('/oligoOrder', function(req, res, next){
  res.render('./designSteps/oligoOrder', { title: 'order_your_oligoo'});
});

router.get('/processing/:id', function(req, res, next){
  res.render('processing_page', 
    {title: 'ribozoft_processing',
     pageTitle: 'design_in_process'});
});

router.get('/results/:id', function(req, res, next){
  var path = require('path').join(config.home_folder, req.params.id, '/requestState.json');

  var json_output = '', resultMessage = '';
  try {
    json_output = require(path);
  } catch(error){
    resultMessage = 'no_candidates';
  }

  Request.findOne({uuid: req.params.id}, function(err, request){
    var obj = {
      title: 'ribozoft_results',
      stepTitle: 'ribozyme_design_results',
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

/**
 * Config routes
 */
router.get('/config', function(req, res) {
    var configXML = appConfigXML.getConfigXML();
    var ribozymeList = appConfigXML.getRibozymeList();
    var seqStruct = appConfigXML.getSeqStruct('', '');
    var seqTitle = seqStruct['title'];

    res.render('configPage/index', {
        configXML: configXML,
        ribozymeList: ribozymeList,
        seqStruct: seqStruct,
        seqTitle: seqTitle,
        errorMsg: null,
        message: null
    });
});

router.get('/config/getSeq', function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var configXML = appConfigXML.getConfigXML();
    var ribozymeList = appConfigXML.getRibozymeList();
    var seqStruct = appConfigXML.getSeqStruct(query.name, query.type);
    var seqTitle = seqStruct['title'];

    res.render('configPage/index', {
        configXML: configXML,
        ribozymeList: ribozymeList,
        seqStruct: seqStruct,
        seqTitle: seqTitle,
        errorMsg: null,
        message: null
    });
});

router.post('/config/submitXML', function(req, res) {
    var errorMsg = appConfigXML.writeConfigXML(req.body.configXML);
    var configXML = appConfigXML.getConfigXML();
    var ribozymeList = appConfigXML.getRibozymeList();
    var seqStruct = appConfigXML.getSeqStruct('', '');
    var seqTitle = seqStruct['title'];
    var message = null;
    if(errorMsg == null) message = "Configuration Saved!";

    res.render('configPage/index', {
        configXML: req.body.configXML,
        ribozymeList: ribozymeList,
        seqStruct: seqStruct,
        seqTitle: seqTitle,
        errorMsg: errorMsg,
        message: message
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

*/

module.exports = router;

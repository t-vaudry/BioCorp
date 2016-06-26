var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'BioCorp' });
});

router.get('/step0', function(req, res, next){
  res.render('./designSteps/serviceselect', { title: 'Step 0'});
});

router.get('/ribozyme', function(req, res, next){
  res.render('./designSteps/ribozyme', { title: 'Design with Ribozyme'});
});

router.get('/index', function(req, res, next){
  res.render('index', {title: 'BioCorp'});
});

router.get('/license', function(req, res, next){
  res.render('license', {title: 'License'});
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

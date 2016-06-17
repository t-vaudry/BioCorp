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

module.exports = router;

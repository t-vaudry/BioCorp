var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next){
  res.render('./designSteps/step0', {title: 'Step 1'});
});

router.get('/step1', function(req, res, next){
  res.render('./designSteps/step1', {title: 'Step 1'});
});

module.exports = router;

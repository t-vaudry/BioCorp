var express = require('express');
var router = express.Router();
var utils = require('./route_utils');
var config = require('../config/');
var url = require('url');
var mongoose = require('mongoose');
var config_xml_path = require('../../ribozyme-design/config/config.json').env.config_xml_path;
var RibozymeConfigXML = require('../../ribozyme-design/XMLReader/').RibozymeConfigXML;
var appConfigXML = new RibozymeConfigXML(config_xml_path);
var hash = require('./pass').hash;
var mailer = require('../mailer.js');
var dropbox = require('../dropbox.js');
var Puid = require('puid');

var cookie_name = "biocorp_order_cookie";

var getOrderArray = function(req) {
    var orderInfo = null;
    if(Object.prototype.hasOwnProperty.call(req, 'cookies')
        && Object.prototype.hasOwnProperty.call(req.cookies, cookie_name)){
        orderInfo = JSON.parse(req.cookies[cookie_name]);
    } else {
        orderInfo = new Array();
    }
    return orderInfo;
}

var getOrderCount = function(req) {
    var count = 0;
    if(Object.prototype.hasOwnProperty.call(req, 'cookies')
        && Object.prototype.hasOwnProperty.call(req.cookies, cookie_name)){
        count = JSON.parse(req.cookies[cookie_name]).length;
    }
    return count;
}

/* Home page routes. */
var getUserName = function(req) {
  var username = "";
  if (req.session.user) {
      username = req.session.user.firstName + " " + req.session.user.lastName;
  }
  return username;
}

var getUser = function(req) {
  var user = null;
  if (req.session.user) {
      user = req.session.user;
  }
  return user;
}

var indexPageHandler = function(req, res, next) {
  appConfigXML.getConfigXML();
  var ribozymeList = appConfigXML.getRibozymeList('Rz');
  var error = "";
  if(req.query.error){
    error = req.query.error;
  }
  res.render('index', { title: 'bioCorp',
                        orderCount: getOrderCount(req),
                        username: getUserName(req),
                        ribozymeList: ribozymeList,
                        error: error });
}

router.get('/', indexPageHandler);
router.get('/index', indexPageHandler);

/* Login/Signup routes */
router.get("/signup", function (req, res) {
    appConfigXML.getConfigXML();
    var ribozymeList = appConfigXML.getRibozymeList('Rz');
    var error = "";
    if(req.query.error){
        error = req.query.error;
    }
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("./registration", { title: 'registration',
                        orderCount: getOrderCount(req),
                        ribozymeList: ribozymeList,
                        username: getUserName(req),
                        user: null,
                        error: error });
    }
});

var User = mongoose.model('User');

function authenticate(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);

    User.findOne({
        username: name
    },
    function (err, user) {
        if (user) {
            if (err) return fn(new Error('cannot find user'));
            hash(pass, user.salt, function (err, hash) {
                if (err) return fn(err);
                if (hash == user.hash) return fn(null, user);
                fn(new Error('invalid password'));
            });
        } else {
            return fn(new Error('cannot find user'));
        }
    });

}

function requiredAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/?error=access_denied');
    }
}

function userExist(req, res, next) {
    if (req.session.user){
        var user = req.session.user;
        var password = req.body.password;
        var dataToUpdate = { password: req.body.password,
                            username: req.body.emailaddr,
                            firstName: req.body.firstname,
                            lastName: req.body.lastname,
                            accountHolder: req.body.accHolder,
                            institution: req.body.institution,
                            poNumber: req.body.ponumber,
                            invoiceBy: req.body.invoice};

        hash(password, function (err, salt, hash) {
            if (err) throw err;
            User.update({_id: user._id}, dataToUpdate, function (err) {
                if (err) throw err;
                authenticate(user.username, password, function(err, user){
                    if(user){
                        req.session.regenerate(function(){
                            req.session.user = user;
                            req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                            res.redirect('/');
                        });
                    }
                });
            });
        });
    } else {
        User.count({
            username: req.body.emailaddr
        }, function (err, count) {
            if (count === 0) {
                next();
            } else {
                req.session.error = "user_exists"
                res.redirect("/signup?error=user_exists");
            }
        });
    }
}

router.post("/signup", userExist, function (req, res) {
    var password = req.body.password;
    var username = req.body.emailaddr;
    var firstName = req.body.firstname;
    var lastName = req.body.lastname;
    var accountHolder = req.body.accHolder;
    var institution = req.body.institution;
    var poNumber = req.body.ponumber;
    var invoiceBy = req.body.invoice;

    hash(password, function (err, salt, hash) {
        if (err) throw err;
        var user = new User({
            username: username,
            salt: salt,
            hash: hash,
            firstName: firstName,
            lastName: lastName,
            accountHolder: accountHolder,
            institution: institution,
            poNumber: poNumber,
            invoiceBy: invoiceBy
        }).save(function (err, newUser) {
            if (err) throw err;
            authenticate(newUser.username, password, function(err, user){
                if(user){
                    req.session.regenerate(function(){
                        req.session.user = user;
                        req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                        res.redirect('/');
                    });
                }
            });
        });
    });
});

router.post("/login", function (req, res) {
    authenticate(req.body.username, req.body.password, function (err, user) {
        if (user) {

            req.session.regenerate(function () {

                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                res.redirect('/');
            });
        } else {
            req.session.error = 'Authentication failed, please check your ' + ' username and password.';
            res.redirect('/?error=auth_fail');
        }
    });
});

router.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    });
});


router.get('/profile', requiredAuthentication, function (req, res) {
    appConfigXML.getConfigXML();
    var ribozymeList = appConfigXML.getRibozymeList('Rz');
  if (req.session.user) {
    res.render("./registration",
        { title: 'registration',
          orderCount: getOrderCount(req),
          ribozymeList: ribozymeList,
          username: getUserName(req),
          user: req.session.user,
          error: "" });
  } else {
    res.redirect('/');      
  }
});

/* Order Processing*/
var Item = mongoose.model('Item');

router.post("/ribozymeDesignAddToCart", function (req, res) {
    var orderInfo = getOrderArray(req);
    var oligoOrderArray = JSON.parse(req.body.ribozymeDesignOligos);

    var index = 0;
    function saveOrder(){
        if(index < oligoOrderArray.length){
            var oligoOrder = new Object();
            oligoOrder.orderType = "ribozymeDesignOligo";
            oligoOrder.orderItem = oligoOrderArray[index++];
            var item = new Item({
                json: JSON.stringify(oligoOrder)
            }).save(function (err, newItem) {
                if (err) throw err;
                orderInfo.push(newItem._id);
                console.log( "index: " + index + " !Saved item id: " + newItem._id);
                if(index == oligoOrderArray.length){
                    console.log("JSON.stringify(orderInfo): " + JSON.stringify(orderInfo));
                    res.cookie(cookie_name , JSON.stringify(orderInfo));
                    res.redirect('/orderProcessing');            
                } else {
                    saveOrder();
                }
            });
        }
    }
    saveOrder();
});

router.post("/oligoAddToCart", function (req, res) {
    var orderInfo = getOrderArray(req);
    var oligoOrder = JSON.parse(JSON.stringify(req.body));
    oligoOrder.orderType = "oligo";
    var item = new Item({
        json: JSON.stringify(oligoOrder)
    }).save(function (err, newItem) {
        if (err) throw err;
        orderInfo.push(newItem._id);
        res.cookie(cookie_name , JSON.stringify(orderInfo));
        res.redirect('/orderProcessing');
    });
});

router.post("/bulkOligoAddToCart", function (req, res) {
    var orderInfo = getOrderArray(req);
    var oligoOrderArray = JSON.parse(req.body.bulkOligo);
    var oligoOrder = new Object();
    oligoOrder.orderType = "bulkOligo";
    oligoOrder.orderList = oligoOrderArray;
    var item = new Item({
        json: JSON.stringify(oligoOrder)
    }).save(function (err, newItem) {
        if (err) throw err;
        orderInfo.push(newItem._id);
        res.cookie(cookie_name , JSON.stringify(orderInfo));
        res.redirect('/orderProcessing');
    });
});

router.post("/removeOrderItem", function (req, res) {
    var orderInfo = getOrderArray(req);
    Item.remove({
        _id: orderInfo[req.body.removeOrderItem]
    },
    function (err) {
        if (err){
            console.log('cannot find item');
        } else {
            orderInfo.splice(req.body.removeOrderItem, 1);
            res.cookie(cookie_name , JSON.stringify(orderInfo));
            res.redirect('/orderProcessing');
        }
    });
});

router.get('/orderProcessing', function(req, res, next){
    appConfigXML.getConfigXML();
    var ribozymeList = appConfigXML.getRibozymeList('Rz');
    var order = getOrderArray(req);
    var newOrderArray = new Array();
    if(order.length == 0) {
        res.render('orderProcessing', { title: 'order_summary',
                                        order: newOrderArray,
                                        orderCount: order.length,
                                        ribozymeList: ribozymeList,
                                        username: getUserName(req),
                                        user:  getUser(req),
                                        error: ""});
    } else {
        var index = 0;
        function findItems(){
            Item.findOne({
                _id: order[index++]
            },
            function (err, item) {
                if (item) {
                    if (err) console.log('cannot find item');
                    newOrderArray.push(JSON.parse(item.json));
                    if(index == order.length){
                        res.render('orderProcessing', { title: 'order_summary',
                                                        order: newOrderArray,
                                                        orderCount: order.length,
                                                        ribozymeList: ribozymeList,
                                                        username: getUserName(req),
                                                        user:  getUser(req),
                                                        error: ""});
                    } else {
                        findItems();
                    }
                } else {
                    console.log('cannot find item');
                }
            });
        }
        findItems();
    }
});

router.post('/confirmation', function(req, res, next){
    appConfigXML.getConfigXML();
    var ribozymeList = appConfigXML.getRibozymeList('Rz');
    var mailContent = JSON.parse(req.body.personalData);
    var order = getOrderArray(req);
    var newOrderArray = new Array();

    var index = 0;
    function findItems(){
        Item.findOne({
            _id: order[index++]
        },
        function (err, item) {
            if (item) {
                if (err) console.log('cannot find item');
                newOrderArray.push(JSON.parse(item.json));
                if(index == order.length){
                    var puid = new Puid(true);
                    mailContent.order = newOrderArray
                    mailContent.order_number = puid.generate();
                    mailer.notifyCustomer(mailContent, function(success){
                        if(success){
                            var emptyJSON = JSON.stringify(new Array());
                            req.cookies[cookie_name] = emptyJSON;
                            res.cookie(cookie_name , emptyJSON);
                            res.render('orderConfirmation', { title: 'order_confirmation',
                                                            orderCount: getOrderCount(req),
                                                            ribozymeList: ribozymeList,
                                                            username: getUserName(req),
                                                            user:  getUser(req),
                                                            error: ""});
                        }
                    });
                    dropbox.uploadFile(mailContent, function() {});
                } else {
                    findItems();
                }
            } else {
                console.log('cannot find item');
            }
        });
    }
    findItems();
});

/* Ribozyme routes */

router.get('/ribozyme', function(req, res, next){
  appConfigXML.getConfigXML();
  var ribozymeList = appConfigXML.getRibozymeList('Rz');
  var ribozymeHelixSizes = appConfigXML.getRibozymeHelixSizes();
  var cutsiteList = appConfigXML.getCutsiteList();
  res.render('./designSteps/ribozyme',
    { title: 'design_with_ribozyme',
      seqtitle: 'select_the_sequence',
      orderCount: getOrderCount(req),
      ribozymeList: ribozymeList,
      ribozymeHelixSizes: ribozymeHelixSizes,
      cutsiteList: cutsiteList,
      username: getUserName(req),
      error: ""});
});

router.get('/crispr', function(req, res, next){
    appConfigXML.getConfigXML();
    var ribozymeList = appConfigXML.getRibozymeList();
  res.render('./designSteps/ribozyme',
    { title: 'design_crispr',
      seqtitle: 'select_sequence_crispr',
      orderCount: getOrderCount(req),
      ribozymeList: ribozymeList,
      username: getUserName(req)});
});

router.get('/license', function(req, res, next){
  res.render('license', {title: 'license',
                        username: getUserName(req),
                        error: ""});
});

router.get('/oligoOrder', function(req, res, next){
    appConfigXML.getConfigXML();
    var ribozymeList = appConfigXML.getRibozymeList('Rz');
  res.render('./designSteps/oligoOrder', { title: 'order_your_oligoo',
                                        orderCount: getOrderCount(req),
                                        ribozymeList: ribozymeList,
                                        username: getUserName(req),
                                        error: ""});
});

router.get('/processing/:id', function(req, res, next){
    appConfigXML.getConfigXML();
    var ribozymeList = appConfigXML.getRibozymeList('Rz');
  res.render('processing_page', 
    {title: 'ribozoft_processing',
    pageTitle: 'design_in_process',
    orderCount: getOrderCount(req),
    ribozymeList: ribozymeList,
    username: getUserName(req),
    error: ""});
});

router.get('/results/:id', function(req, res, next){

  appConfigXML.getConfigXML();
  var ribozymeList = appConfigXML.getRibozymeList();
  var enzymeList = appConfigXML.getEnzymeList();

  var path = require('path').join(config.home_folder, req.params.id, '/requestState.json');

  var json_output = '', resultMessage = '';
  try {
    json_output = require(path);
  } catch(error){
    resultMessage = 'no_candidates';
  }

  var Request = mongoose.model('Request');
  Request.findOne({uuid: req.params.id}, function(err, request){
    var obj = {
        title: 'ribozoft_results',
        stepTitle: 'ribozyme_design_results',
        orderCount: getOrderCount(req),
        ribozymeList: ribozymeList,
        enzymeList: enzymeList,
        username: getUserName(req),
        results: json_output,
        resultMessage: resultMessage,
        input: {},
        error: ""
    };

    if(err){
      res.render('results_processing', obj);
    } else if(!request){
      res.redirect('/error');
    } else{
      obj.input = {
        sequence: request.sequence,
        accessionNumber: request.accessionNumber,
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
      res.render('results_processing', obj);
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

router.get('/aboutUs', function(req, res, next){
  appConfigXML.getConfigXML();
  var ribozymeList = appConfigXML.getRibozymeList('Rz');
  res.render('aboutUs',
    { title: 'about_us',
      orderCount: getOrderCount(req),
      ribozymeList: ribozymeList,
      username: getUserName(req),
      error: ""});
});

module.exports = router;

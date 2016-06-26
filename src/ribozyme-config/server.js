// server.js
var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var url = require('url');
var RibozymeConfigXML = require('./XMLReader/').RibozymeConfigXML;

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

var ribozymeConfigXML = new RibozymeConfigXML('ribozyme.xml');

// index page 
app.get('/', function(req, res) {
    var configXML = ribozymeConfigXML.getConfigXML();
    var ribozymeList = ribozymeConfigXML.getRibozymeList();
    var seqStruct = ribozymeConfigXML.getSeqStruct('', '');
    var seqTitle = seqStruct['name'] + '-' + seqStruct['type'];

    res.render('pages/index', {
        configXML: configXML,
        ribozymeList: ribozymeList,
        seqStruct: seqStruct,
        seqTitle: seqTitle
    });
});

app.get('/getSeq', function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var configXML = ribozymeConfigXML.getConfigXML();
    var ribozymeList = ribozymeConfigXML.getRibozymeList();
    var seqStruct = ribozymeConfigXML.getSeqStruct(query.name, query.type);
    var seqTitle = query.name + '-' + query.type;

    res.render('pages/index', {
        configXML: configXML,
        ribozymeList: ribozymeList,
        seqStruct: seqStruct,
        seqTitle: seqTitle
    });
});

app.post('/submitXML', function(req, res) {
    ribozymeConfigXML.writeConfigXML(req.body.configXML);
    var configXML = ribozymeConfigXML.getConfigXML();
    var ribozymeList = ribozymeConfigXML.getRibozymeList();
    var seqStruct = ribozymeConfigXML.getSeqStruct('', '');
    var seqTitle = seqStruct['name'] + '-' + seqStruct['type'];

    res.render('pages/index', {
        configXML: configXML,
        ribozymeList: ribozymeList,
        seqStruct: seqStruct,
        seqTitle: seqTitle
    });
});

app.listen(port);
console.log(port + ' is the magic port');

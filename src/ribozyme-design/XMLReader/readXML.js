var fs = require('fs'),
    xml2js = require('xml2js'),
    util = require('util');

function RibozymeConfigXML(xmlPath){
    this.xmlPath = xmlPath;
}

RibozymeConfigXML.prototype.getSeqStruct = function(ribozymeName, ribozymeType){
    var valuesToReturn = new Object();
    this.parser.parseString(this.data, function (err, result) {
        result.root.ribozyme.forEach(function(ribozyme) {
            var name = ribozyme.$['name'];
            var type = ribozyme.$['type'];
            var title = ribozyme.$['title'];
            var structure = ribozyme.$['structure'];
            if(ribozymeName == '' && ribozymeType == ''){
                ribozymeName = name;
                ribozymeType = type;
            }
            if(name == ribozymeName && type == ribozymeType){
                var position = 0;
                var sequence = '';
                var structure = '';
                ribozyme.seq.forEach(function(seq) {
                    if(seq.$['strand'] == 'single'){
                        var lengthFrom = seq.$['lengthFrom'];
                        var lengthTo = seq.$['lengthTo'];
                        var pkFrom = seq.$['pkFrom'];
                        var pkTo = seq.$['pkTo'];
                        var substrate = seq.$['substrate'];
                        var length = 0;

                        if (typeof seq._ !== 'undefined') {
                            sequence += seq._;
                            if(typeof pkFrom === 'undefined'){
                                for(var i = 0; i < seq._.length; i ++){
                                    structure += '.';
                                    position++; 
                                }
                            }
                        }

                        if(typeof lengthFrom !== 'undefined'){
                            length = Math.round((parseInt(lengthFrom) + parseInt(lengthTo))/2);
                            for(var i = 0; i < length; i ++){
                                sequence += 'N'; 
                                structure += '.';
                                position++;
                            }
                        } else if(typeof pkFrom !== 'undefined'){
                            if (typeof seq._ !== 'undefined') {
                                length = parseInt(pkTo) - parseInt(pkFrom) + 1;
                                for(var i = 0; i < length; i++){
                                    if(position < pkFrom){
                                        structure += '[';
                                    } else {
                                        structure += ']';
                                    }
                                    position++;
                                }
                            } else {
                                length = parseInt(pkTo) - parseInt(pkFrom) + 1;
                                for(var i = 0; i < length; i ++){
                                    sequence += 'N'; 
                                    structure += '.';
                                    position++;
                                }
                            }
                        }
                    } else if(seq.$['strand'] == 'double'){
                        sequence += seq._;
                        var from = parseInt(seq.$['from']);
                        var to = parseInt(seq.$['to']);
                        for(var i = 0; i < seq._.length; i ++){
                            if(position < from){
                                structure += '(';
                            } else {
                                structure += ')';
                            }
                            position++; 
                        }
                    }
                });
                valuesToReturn['sequence'] = sequence;
                valuesToReturn['structure'] = structure;
                valuesToReturn['name'] = ribozymeName;
                valuesToReturn['type'] = ribozymeType;
                valuesToReturn['title'] = title;
            }
        });
    });
    return valuesToReturn;
}

RibozymeConfigXML.prototype.getRzByNameType = function(ribozymeName, ribozymeType){
    var ribozymeToReturn = null;
    this.parser = new xml2js.Parser();
    this.data = fs.readFileSync(this.xmlPath, 'utf8');
    this.parser.parseString(this.data, function (err, result) {
        result.root.ribozyme.forEach(function(ribozyme) {
            if(ribozyme.$['name'] == ribozymeName && ribozyme.$['type'] == ribozymeType){
                ribozymeToReturn = ribozyme;
            }
        });
    });
    return ribozymeToReturn;
}

RibozymeConfigXML.prototype.getRibozymeList = function(){
    var valuesToReturn = new Array();
    this.parser.parseString(this.data, function (err, result) {
        result.root.ribozyme.forEach(function(ribozyme) {
            var valuesToPush = new Object();
            valuesToPush['name'] = ribozyme.$['name'];
            valuesToPush['type'] = ribozyme.$['type'];
            valuesToPush['structure'] = ribozyme.$['structure'];             
            valuesToPush['title'] = ribozyme.$['title'];             
            valuesToReturn.push(valuesToPush);
        });
    });
    return valuesToReturn;
}

RibozymeConfigXML.prototype.getRibozymeHelixSizes = function(){
    var valuesToReturn = new Array();
    this.parser.parseString(this.data, function (err, result) {
        result.root.ribozyme.forEach(function(ribozyme) {
            var helixValuesToPush = new Array();
            var rzName = ribozyme.$['name'];
            var rzType = ribozyme.$['type'];
            ribozyme.seq.forEach(function(sequence){
                var name = sequence.$['name'];
                if(typeof name !== 'undefined'){
                    var helixValue = new Object();
                    helixValue['helixName'] = name;
                    helixValue['helixId'] = sequence.$['id'];
                    helixValue['lengthFrom'] = sequence.$['lengthFrom'];
                    helixValue['lengthTo'] = sequence.$['lengthTo'];
                    helixValuesToPush.push(helixValue);
                }
            });
            valuesToReturn.push({"name": rzName, "type": rzType, "helixValues": helixValuesToPush});
        });
    });
    return valuesToReturn;
}

RibozymeConfigXML.prototype.getCutsiteList = function(){
    var valuesToReturn = new Array();
    this.parser.parseString(this.data, function (err, result) {
        result.root.ribozyme.forEach(function(ribozyme) {
            var rzName = ribozyme.$['name'];
            var rzType = ribozyme.$['type'];
            var cutsiteList = new Array();
            ribozyme.cutsite[0].seq.forEach(function(sequence){
                cutsiteList.push(sequence._);
            });
            valuesToReturn.push({"name": rzName, "type": rzType, "cutsites": cutsiteList});
        });
    });
    return valuesToReturn;
}

RibozymeConfigXML.prototype.getConfigXML = function(){
    this.parser = new xml2js.Parser();
    this.data = fs.readFileSync(this.xmlPath, 'utf8');
    return this.data;
}

RibozymeConfigXML.prototype.writeConfigXML = function(xml){
    var thisObj = this;
    var errorMsg = null;
    this.parser.parseString(xml, function (err, result) {
        if (err) {
            errorMsg = "Parse error: " + err.message;
        } else {
            fs.writeFileSync(thisObj.xmlPath, xml)
        }
    });
    return errorMsg;
}

exports.RibozymeConfigXML = RibozymeConfigXML;
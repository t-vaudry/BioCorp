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
                console.log('sequence : ' + sequence);
                console.log('structure: ' + structure);
                valuesToReturn['sequence'] = sequence;
                valuesToReturn['structure'] = structure;
                valuesToReturn['name'] = ribozymeName;
                valuesToReturn['type'] = ribozymeType;
            }
        });
        console.log('Done');
    });
    return valuesToReturn;
}

RibozymeConfigXML.prototype.getRibozymeList = function(){
    var valuesToReturn = new Array();
    this.parser.parseString(this.data, function (err, result) {
        result.root.ribozyme.forEach(function(ribozyme) {
            var valuesToPush = new Object();
            valuesToPush['name'] = ribozyme.$['name'];
            valuesToPush['type'] = ribozyme.$['type'];
            valuesToPush['structure'] = ribozyme.$['structure'];             
            valuesToReturn.push(valuesToPush);
        });
        console.log('Done');
    });
    return valuesToReturn;
}

RibozymeConfigXML.prototype.getConfigXML = function(){
    this.parser = new xml2js.Parser();
    this.data = fs.readFileSync(this.xmlPath, 'utf8');
    return this.data;
}

RibozymeConfigXML.prototype.writeConfigXML = function(xml){
    fs.writeFileSync(this.xmlPath, xml)
}

exports.RibozymeConfigXML = RibozymeConfigXML;
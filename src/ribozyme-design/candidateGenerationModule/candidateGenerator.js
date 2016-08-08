var RibozymeConfigXML = require('../XMLReader/').RibozymeConfigXML;
var Utils = require('../AlgorithmUtilities.js');
var Log = require('./../log/').Log;
var config = require('../config/config.json');
var config_xml_path = config.env.config_xml_path;
var ReverseComplement = Utils.ReverseComplement;
var Reverse = Utils.Reverse;
var Complement = Utils.Complement;
var DnaToRna = Utils.DnaToRna;

function FindCutsites(seq, cutSiteType)
{
    Log("Finding cutsites type " + cutSiteType + " for seq " + seq, "FindCusites", 15);
	var loc = new Array();
	res = -1;
	do
	{
	    res = seq.indexOf(cutSiteType, res + 1);
		if(res !== -1)
			loc.push(res);
	}
	while (res !== -1);
	Log("Number of cutsites type " + cutSiteType + " found was " + loc.length, "FindCusites", 20);
  if( loc.length > 40 )
  {  
    Log("WARNING: Preventive measures are in effect as more than 40 cut-sites where found. Only first 10 will be kept")
    loc.splice(10);
  }   
	return loc;
}

function CreateCandidates (substrateSeq, cutSiteType, cutSites, options)
{
	var Candidates = new Array();

	var rzNameType = options.ribozymeSelection.split("-");
	var rzName = rzNameType[0];
	var rzType = rzNameType[1];
	Log("Config XML path: " + config_xml_path, "CreateCandidates", 10);
	var config = new RibozymeConfigXML(config_xml_path);
	var ribozyme = config.getRzByNameType(rzName, rzType);

	for(var ii = 0 ; ii < cutSites.length;++ii)
	{
	    Log("Creating candidates for cutsite location " + cutSites[ii], "CreateCandidates", 10);
	    // firstCutsiteCands.BaseSequence = ''; //Keep track of the longest base sequence for the given cutsite
		var arrayOfCandidateSeqs = new Array();
		var avoidCutsite = false;
		var smallestStart = 999999;
		var highestEnd = 0;
		ribozyme.seq.forEach(function(seq) {
			var candidateSeqs = new Array();
			if(seq.$['strand'] == 'single'){
				var lengthFrom = seq.$['lengthFrom'];
				var lengthTo = seq.$['lengthTo'];
				var pkFrom = seq.$['pkFrom'];
				var pkTo = seq.$['pkTo'];
				var substrate = seq.$['substrate'];
				var substrDistFromCutsite = seq.$['substrDistFromCutsite'];
				var substrateDirection = seq.$['substrateDirection'];

				if (typeof seq._ !== 'undefined') {
					candidateSeqs.push({"seq" : Reverse(seq._), "complementary" :false, "pk" :false});
				}
				if (typeof lengthFrom !== 'undefined') {
					lengthFrom = parseInt(lengthFrom);
					lengthTo = parseInt(lengthTo);

					var id = seq.$['id'];
					if (typeof id !== 'undefined') {
						var arm_min = id + '_min';
						if(arm_min in options && options[arm_min] > 0) lengthFrom = parseInt(options[arm_min]);

						var arm_max = id + '_max';
						if(arm_max in options && options[arm_max] > 0) lengthTo = parseInt(options[arm_max]);
					}

					substrDistFromCutsite = parseInt(substrDistFromCutsite);
					for(var length = lengthFrom; length <= lengthTo; length++){
						if(substrateDirection == '5-3'){
							var start = cutSites[ii] + substrDistFromCutsite;
							if ( substrateSeq.length < (start + length - 1) ) continue;
							if(start < smallestStart ) smallestStart = start;
							if((start + length - 1) > highestEnd) highestEnd = start + length - 1;

							if(substrate == 'complementary'){
								candidateSeqs.push({"seq" : Complement(substrateSeq.substr(start,length)),
								 "complementary" :true, 
								 "pk" :false, 
								 "cutsiteRelativePos" :"right", 
								 "substrDistFromCutsite": substrDistFromCutsite});
							} else if(substrate == 'same'){
								var strand = substrateSeq.substr(start,length);
								candidateSeqs.push({"seq" : substrateSeq.substr(start,length),
								 "complementary" :false, 
								 "pk" :false, 
								 "cutsiteRelativePos" :"right"});
							}
						} else if(substrateDirection == '3-5'){
							var start = cutSites[ii] - substrDistFromCutsite - (length - 1);
							if(start < 0) continue;
							if(start < smallestStart ) smallestStart = start;
							if((start + length - 1) > highestEnd) highestEnd = start + length - 1;

							if(substrate == 'complementary'){
								candidateSeqs.push({"seq" : Complement(substrateSeq.substr(start,length)),
								 "complementary" :true, 
								 "pk" :false, 
								 "cutsiteRelativePos" :"left", 
								 "substrDistFromCutsite": substrDistFromCutsite});
							} else if(substrate == 'same'){
								candidateSeqs.push({"seq" : substrateSeq.substr(start,length),
								 "complementary" :false, 
								 "pk" :false, 
								 "cutsiteRelativePos" :"left"});
							}
						}
					}
				} else if (typeof pkFrom !== 'undefined') {
					pkFrom = parseInt(pkFrom);
					pkTo = parseInt(pkTo);
					substrDistFromCutsite = parseInt(substrDistFromCutsite);
					var length = pkTo - pkFrom + 1;
					if(substrateDirection == '5-3'){
						var start = cutSites[ii] + substrDistFromCutsite;
						if(start < smallestStart ) smallestStart = start;
						if((start + length - 1) > highestEnd) highestEnd = start + length - 1;

						if(substrate == 'complementary'){
							var strand = substrateSeq.substr(start,length);
							candidateSeqs.push({"seq" : Complement(substrateSeq.substr(start,length)),
							 "complementary" :true, 
							 "pk" :true, 
							 "cutsiteRelativePos" :"right", 
							 "substrDistFromCutsite": substrDistFromCutsite});
						} else if(substrate == 'same'){
							candidateSeqs.push({"seq" : substrateSeq.substr(start,length),
							 "complementary" :false, 
							 "pk" :true, 
							 "cutsiteRelativePos" :"right"});
						}
					} else if(substrateDirection == '3-5'){
						var start = cutSites[ii] - substrDistFromCutsite - (length - 1);
						if(start < smallestStart ) smallestStart = start;
						if((start + length - 1) > highestEnd) highestEnd = start + length - 1;

						if(substrate == 'complementary'){
							candidateSeqs.push({"seq" : Complement(substrateSeq.substr(start,length)),
							 "complementary" :true, 
							 "pk" :true, 
							 "cutsiteRelativePos" :"left", 
							 "substrDistFromCutsite": substrDistFromCutsite});
						} else if(substrate == 'same'){
							candidateSeqs.push({"seq" : substrateSeq.substr(start,length),
							 "complementary" :false, 
							 "pk" :true, 
							 "cutsiteRelativePos" :"left"});
						}
					}
				}
			} else if(seq.$['strand'] == 'double'){
				candidateSeqs.push({"seq" : Reverse(seq._), "complementary" :false, "pk" :false});
			}
			if(candidateSeqs.length == 0) avoidCutsite = true;
			arrayOfCandidateSeqs.push(candidateSeqs);
		});

		if(avoidCutsite) 
			continue;

	    var cutsiteCandidates = new Array();
		for(var a = arrayOfCandidateSeqs.length - 1; a >= 0; a--){
			var candidateSeqs = arrayOfCandidateSeqs[a];
			var newCandidates = new Array();
			for(var b = 0; b < candidateSeqs.length; b++){
				var seq = candidateSeqs[b].seq;
				var complementary = candidateSeqs[b].complementary;
				var pk = candidateSeqs[b].pk;
				var cutsiteRelativePos = candidateSeqs[b].cutsiteRelativePos;
				var substrDistFromCutsite = candidateSeqs[b].substrDistFromCutsite;
				if(cutsiteCandidates.length == 0){
					var compPositions = new Array();
					if(complementary){
						compPositions.push({"start" : 0,
						 "end": seq.length - 1, 
						 "pk" :pk, 
						 "cutsiteRelativePos": cutsiteRelativePos,
						 "substrDistFromCutsite": substrDistFromCutsite
						});
					}
					newCandidates.push({"seq" : seq, "targetLocation" :cutSites[ii], "compPositions" : compPositions });
				} else {
					for(var c = 0; c < cutsiteCandidates.length; c++){
						var compPositions = cutsiteCandidates[c].compPositions.slice();
						if(complementary){
							var start = cutsiteCandidates[c].seq.length;
							compPositions.push({"start" : start,
							 "end": start + seq.length - 1, 
							 "pk" :pk,
							 "cutsiteRelativePos": cutsiteRelativePos,
							 "substrDistFromCutsite": substrDistFromCutsite
							});
						}
						newCandidates.push({"seq" : cutsiteCandidates[c].seq + seq, "targetLocation" :cutSites[ii], "compPositions" : compPositions });
					}
				}
			}
			cutsiteCandidates = newCandidates;
		}

		//Keep track of the longest base sequence for the given cutsite
		cutsiteCandidates.BaseSequence = substrateSeq.substring(smallestStart, highestEnd);
		cutsiteCandidates.BaseCutindex = cutSites[ii] + (cutSiteType.length - 1);

		for(var d = 0; d < cutsiteCandidates.length; d++){
			cutsiteCandidates[d].seq = Reverse(cutsiteCandidates[d].seq);
			for(var e = 0; e < cutsiteCandidates[d].compPositions.length; e++){
				var compPosition = cutsiteCandidates[d].compPositions[e];
				var start = compPosition.start;
				var end = compPosition.end;
				var length = cutsiteCandidates[d].seq.length;
				compPosition.end = length - start - 1;
				compPosition.start = length - end - 1;
				if(compPosition.cutsiteRelativePos == "left"){
					compPosition.cutsiteRelativePos = "right";
				} else if(compPosition.cutsiteRelativePos == "right"){
					compPosition.cutsiteRelativePos = "left";
				}
			}
			
		}

		Candidates.push(cutsiteCandidates);
	}

	return Candidates;
}


function GenerateCandidates( sequence, cutSiteType, options )
{
	var csites = FindCutsites (sequence, cutSiteType);
	var candidates = CreateCandidates(sequence, cutSiteType, csites, options);
	return candidates;
}

exports.GenerateCandidates = GenerateCandidates;
exports.FindCutsites = FindCutsites;
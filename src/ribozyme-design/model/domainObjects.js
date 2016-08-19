var MeltingTCalcRouter = require('../meltingTemp/').MeltingTCalcRouter;
var RibozymeConfigXML = require('../XMLReader/').RibozymeConfigXML;
var config = require('../config/config.json');
var config_xml_path = config.env.config_xml_path;
var AlgorithmUtilities = require('../AlgorithmUtilities.js');


    function Request ( targetSequence , accessionNumber, preferences , Id , inVivoOrganism ,callback)
    {
        this.ID = Id;
        this.TargetSequence = targetSequence;
        this.AccessionNumber = accessionNumber == undefined? null : accessionNumber;
        this.Preferences = preferences;
        this.Completed = false;
        this.State = '\n';
        this.Callback = callback;
        this.ErrorContainer = new Array();
        this.InVivoOrganism = inVivoOrganism;
        this.Part = 0;
        this.PartProgress = 0;
        //Completed 1 => Candidate Generation
        //Completed 2 => Annealing
        //Completed 3 => Folding candidates
        //Completed 4 => Folding target
        if (this.Preferences != undefined && this.Preferences != null)
        {
            var temp = this.Preferences.tempEnv;
            if (temp != undefined && temp != null) {
                this.Preferences.tempEnv = temp + 273;//transform to abosolute (K)
            }
            else
                this.Preferences.tempEnv = 37 + 273;
        }
    }

    Request.prototype.UpdateState = function (state)
    {
        this.State += '\n' + state;
    }


    Request.prototype.ResetAndSignalProgress = function (newPart)
    {
	    var self = this;
	    self.Callback(self);
        this.Part = newPart;
        this.PartProgress = 0;
    }

    function CutsiteTypeCutsiteContainer(type)
    {
        this.Type = type;
        this.Cutsites = null;//array of cutsites
    }


    function Candidate(sequence, Id, requestID, cutsiteID, cutSiteLocation,
        meltingTemperature, meltList, complimentaryPositions, samePositions, armLengthList)
    {
        this.Sequence = sequence;
        this.ID = Id;
        this.StructuresSFold = new Array();
        this.Fitness_Shape = 0;
        this.Fitness_Shape_dG = 0;
        this.Fitness_Target = 0;
        this.Fitness_Target_dG = 0;
        this.Fitness_Specificity = 0;
        this.Fitness_AnnealingT = 0;
        this.cutSiteID = cutsiteID;
        this.cutSiteLocation = cutSiteLocation;
        this.requestID = requestID;
        this.MeltingTemperature = meltingTemperature;
        this.MeltingTemperatureList = meltList;
        this.complimentaryPositions = complimentaryPositions;
        this.samePositions = samePositions;
        this.ArmLengthList = armLengthList;
    }


    function StructureInfo (minEnergy,maxEnergy,freq,LowestFreeEnergy)
    {
        this.EnergyInterval = {'Min': minEnergy, 'Max' : maxEnergy};
        this.Frequency = freq;
        this.LowestFreeEnergy = LowestFreeEnergy;
        this.ConnectedPairs = new Array();
        this.Fitness = -1;
    }

    StructureInfo.prototype.toString = function ( )
    {
        var pairs = this.ConnectedPairs;
        var res = "Structure " + " freq:" + this.Frequency + ' LFE:' + this.LowestFreeEnergy + ' fitness:' + this.Fitness +'\n';
        for (var ii = 0; ii < pairs; ++ii)
        {
            res += '\t' + pairs[ii].type + ' pos:' + pairs[ii].left + ' connected to:' + (pairs.right == -1? 'nothing' :  pairs.right);
        }
        return res;
    }


    StructureInfo.prototype.AddPair = function ( left, right, type)
    {
        this.ConnectedPairs.push({'left':left,'right':right,'type':type});
    }

    StructureInfo.prototype.EvaluateHotknot = function (prefs, candidate)
    {
        if (prefs == undefined)
            prefs = null;
        //Find first pair of catalitic core
        var pairs = this.ConnectedPairs;
        this.Fitness = 0;

        var rzNameType = prefs.ribozymeSelection.split("-");
        var rzName = rzNameType[0];
        var rzType = rzNameType[1];
        var config = new RibozymeConfigXML(config_xml_path);
        config.getConfigXML();

        var positionList = candidate.complimentaryPositions.slice();
        positionList = positionList.concat(candidate.samePositions);
        armLengthList = AlgorithmUtilities.CalculateArmLength(positionList);

        var seqStruct = config.getSeqStruct(rzName, rzType, armLengthList);

        var connectedPairsTemplate = AlgorithmUtilities.convertSeqStructToIndexStruct(
            seqStruct.sequence, seqStruct.structure);

        var excludedPairs = '';
        for(var ii = 0; ii < pairs.length; ++ii)
        {
            if(connectedPairsTemplate[ii].type == 'N'){
                if(pairs[ii].right > 0){
                    excludedPairs += pairs[ii].type;
                }
            } else {
                if(pairs[ii].right != connectedPairsTemplate[ii].right)
                this.Fitness += 10;
            }
        }
        this.Fitness += MeltingTCalcRouter(excludedPairs, prefs);
    }


    exports.Request = Request;
    exports.Candidate = Candidate;
    exports.StructureInfo = StructureInfo;
    exports.CutsiteTypeCutsiteContainer = CutsiteTypeCutsiteContainer;
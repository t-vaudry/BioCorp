var algorithm = require('hammerhead-design'),
    should = require('should'),
    fs = require('fs'),
    lib = require('../index.js'),
    test_utils = require('./test_utils.js');

var RequestExecutor = algorithm.HandleRequest;
var AlgoRequest = algorithm.Model.DomainObjects.Request;

var testID = 'Tes1';
var pathToDir = process.cwd()+'/'+testID;

beforeEach(function(done){
    test_utils.rmDirIfExists(pathToDir);
    done();
});

describe('Algorithm library', function(){
    it('Testing no candidates', function(done){
        var algoRequest = new AlgoRequest(
            'ATGCATGC',
            ' ', //Accesion number
            {
                'tempEnv' :37,
                'naEnv' : 150, //mM
                'mgEnv' : 1, //mM
                'oligoEnv': 12,
                'cutsites' : ['GUC','AUC'],
                'left_arm_min': 3,
                'right_arm_min': 3,
                'left_arm_max':10,
                'right_arm_max':10,
		'promoter' : 'TAATACGACTCACTATAGGG'
            },
            testID,
            0,//CoreType
            'blah',
            function (request)
            {
                if(request.Completed){
                    request.State.should.include('No candidates were generated!');
                    var jsonExists = fs.existsSync(pathToDir+'/requestState.json');
		    if(jsonExists){
			done(new Error('requestState.json was created even when no candidates were generated.'));
		    }
		    else{
			done(null);
		    }
                }
            }
        );
        RequestExecutor.HandleRequestPart1(algoRequest);
    });
});


// Always keep last
after(function(done){
    test_utils.rmDirIfExists(pathToDir);
    done();
});

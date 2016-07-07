var mongoose = require('mongoose'),
    config = require('./config.json');
var Schema = mongoose.Schema;

var Request = require('./request');

/* Candidate Schema */
var Candidate = new Schema({
  parentOutsideTarget: {type: Number},
  coreTypeId: [Number],
  fitness: [Number],
  structuresSFold: [{type: Schema.ObjectId, ref: 'Structure'}],
  structureUNA: {type: Schema.ObjectId, ref: 'Structure'},
  coreStart: Number
});

mongoose.model('Candidate', Candidate);

/* Structure Schema */

var Structure = new Schema({
  parentRep: Schema.Types.Mixed,
  fitness: Number,
  frequence: Number,
  pairs: [{type: Schema.ObjectId, ref: 'Pair'}],
  fitnessdG: Number,
  dG: Number,
  rangedG: [Number]
});

mongoose.model('Structure', Structure);

/* Pair Schema */

var Pair = new Schema({
  left: Number,
  right: Number,
  type: String
});

mongoose.model('Pair', Pair);

if(process.env.NODE_ENV == 'test'){
  mongoose.connect(config.ribosoftTestDbUrl);
} else{
  mongoose.connect(config.ribosoftDbUrl);
}

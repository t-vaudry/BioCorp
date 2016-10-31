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

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String,
    hash: String,
    firstName: String,
    lastName: String,
    accountHolder: String,
    institution: String,
    poNumber: String,
    invoiceBy: String
});

mongoose.model('User', UserSchema);

var ItemSchema = new mongoose.Schema({
    json: String
});

mongoose.model('Item', ItemSchema);

if(process.env.NODE_ENV == 'test'){
  console.log("DB Url: " + config.ribosoftTestDbUrl);
  mongoose.connect(config.ribosoftTestDbUrl);
} else{
  console.log("DB Url: " + config.ribosoftDbUrl);
  mongoose.connect(config.ribosoftDbUrl);
}

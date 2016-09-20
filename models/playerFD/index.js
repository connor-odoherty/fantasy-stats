var mongoose = require('mongoose');
import INFO from './constants/info';
import INFO_CONST from '../../constants/playerInfo';
var async = require('async');

// TODO: Decide explicit deifinition vs flexible stat logging 
// TODO: Do I determine type here, or in the main collection?
// TODO: Add middleware to transform BirthDate to match format of DOB

var playerFDSchema = new mongoose.Schema({
  playerId: { type: String, unique: true, index: true },
  Name: { type: String },
  AverageDraftPositionPPR: { type: Number },
  FirstName: { type: String },
  LastName: { type: String },
  Position: { type: String },
  Team: { type: String, default: 'FA' },
  Number: { type: Number },
  ByeWeek: { type: Number },
  BirthDate: { type: String },
  Height: { type: String },
  Weight: { type: Number }
});

playerFDSchema.statics.matchAttribute = function(attribute, value, callback) {
  this.findOne({ [INFO[attribute]]: value }, function(err, player) {
    callback(err, player);
  });
};

// Add extra error handling here
playerFDSchema.methods.getAttribute = function(attribute, callback) {
  return this.model('PlayerFD').findOne({Name: this.Name}, function(err, value){
    callback(err, value.toObject()[INFO[attribute]]);
  });
}

playerFDSchema.methods.getAttributes = function(attributes, callback) {
  return this.model('PlayerFD').findOne({Name: this.Name}, function(err, value){
    var atts = {};
    async.forEach(attributes, function(attribute, callback) {
      atts[attribute] = value.toObject()[INFO[attribute]];
      callback()
    }, function(err) {
      callback(err, atts);
    });
  });
}

module.exports = mongoose.model('PlayerFD', playerFDSchema);
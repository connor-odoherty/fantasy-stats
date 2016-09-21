var mongoose = require('mongoose');
var INFO = require('./constants/info');
var INFO_MAIN = require('../player/constants/info');
var PLAYER = require('../../constants/playerInfo');
var dataHelpers = require('../../dataHelpers/dataHelpers');
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

/* matchAttribute
 *
 * Finds a player matching the value of a abstracted attribute
 */
playerFDSchema.statics.matchAttribute = function(attribute, value, callback) {
  this.findOne({ [INFO[attribute]]: value }, function(err, player) {
    callback(err, player);
  });
};

/* getAttribute
 *
 * Gets attribute from a document using the abstracted constant
 */
playerFDSchema.methods.getAttribute = function(attribute, callback) {
  return this.model('PlayerFD').findOne({Name: this.Name}, function(err, value){
    callback(err, value.toObject()[INFO[attribute]]);
  });
}

/* convertToMain
 * 
 * Uses the main db's data schema to transform own documents
 */
playerFDSchema.methods.convertToMain = function(callback) {
  return this.model('PlayerFD').findOne({Name: this.Name}, function(err, value) {
    callback(err,  dataHelpers.convertFromTo(INFO, INFO_MAIN, value.toObject()));
  });
}

/* getAttributes
 *
 * Params: list of generic attributes
 * Returns: Obj contianing abstracted attributes
 */
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
var mongoose = require('mongoose');
import INFO from './constants/info';

// TODO: Decide explicit deifinition vs flexible stat logging 
// TODO: Do I determine type here, or in the main collection?
// TODO: Add middleware to transform BirthDate to match format of DOB

var playerFDSchema = new mongoose.Schema({
  PlayerId: { type: String, unique: true, index: true },
  Name: { type: String },
  AverageDraftPositionPPR: { type: Number },
  FirstName: { type: String },
  LastName: { type: String },
  Position: { type: String },
  Team: { type: String },
  Number: { type: Number },
  ByeWeek: { type: Number },
  BirthDate: { type: String },
  Height: { type: String },
  Weight: { type: Number }
});

playerFDSchema.methods.matchAttribute = function(attribute, value, cb) {
  return this.model('PlayerFD').find({ [INFO[attribute]]: value });
};

playerFDSchema.methods.getAttribute = function(document, attribute, cb) {
  return this.model('PlayerFD').find({ [INFO[attribute]]: 1 });
}

module.exports = mongoose.model('PlayerFD', playerFDSchema);
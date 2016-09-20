var mongoose = require('mongoose');
import INFO from './constants/info';

// TODO: Add middleware verifying that team and position match constants
// TODO: Add middleware to transform data to meet generic definition

var playerFFNSchema = new mongoose.Schema({
  playerId: { type: String, unique: true, index: true },
  active: { type: Boolean },
  jersey: { type: Number},
  displayName: { type: String },
  position: { type: String },
  team: { type: String },
  number: { type: Number },
  height: { type: String },
  weight: { type: Number},
  dob: { type: String },
  college: { type: String }
});

playerFFNSchema.statics.matchAttribute = function(attribute, value, cb) {
  return this.model('PlayerFFN').find({ [INFO[attribute]]: value });
};

playerFFNSchema.methods.getAttribute = function(document, attribute, cb) {
  return this.model('PlayerFFN').find({ [INFO[attribute]]: 1 });
}
module.exports = mongoose.model('PlayerFFN', playerFFNSchema);
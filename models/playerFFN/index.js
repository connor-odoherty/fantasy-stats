var mongoose = require('mongoose');

// Do I pull in as is? Or transform as I pull?

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

playerFFNSchema.methods.getAttribute = function(attribute, cb) {
  return this.model('PlayerFNN').find({});
};

module.exports = mongoose.model('PlayerFFN', playerFFNSchema);
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

module.exports = mongoose.model('PlayerFFN', playerFFNSchema);


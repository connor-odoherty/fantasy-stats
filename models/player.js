var mongoose = require('mongoose');

// TODO: Decide explicit deifinition vs flexible stat logging 

var playerSchema = new mongoose.Schema({
  playerId: { type: String, unique: true, index: true },
  name: String,
  position: String,
  teamId: { type: Number, default: 0 },
  number: { type: Number, default: 0 },
  age: { type: Number, default: 0 },
  random: { type: [Number], index: '2d' },
  active: { type: Boolean, default: false },
  updated: { type: Date, default: Date.now }
// STATS NESTED
});

module.exports = mongoose.model('Player', playerSchema);
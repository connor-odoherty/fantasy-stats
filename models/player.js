var mongoose = require('mongoose');

// Do I pull in as is? Or transform as I pull?

// TODO: Decide explicit deifinition vs flexible stat logging 
// TODO: Do I determine type here, or in the main collection?
// TODO: Add createDate
// Explain that casting should not be implicit
// Discuss how to handle future updates
// Maybe random ID gen upon having neither
// Talk about how we don't really need to pull everything in each time

var playerSchema = new mongoose.Schema({
  player_id: { type: String, unique: true, index: true },
  fd_player_id: { type: String },
  ffn_player_id: { type: String },
  name: { type: String },
  adp: { type: Number },
  pos: { type: String },
  team: { type: String },
  number: { type: Number },
  school: { type: String },
  dob: { type: String },
  height: { type: String },
  weight: { type: Number },
  bye: { type: Number }
});

module.exports = mongoose.model('Player', playerSchema);
var mongoose = require('mongoose');

// Do I pull in as is? Or transform as I pull?

// TODO: Decide explicit deifinition vs flexible stat logging 
// TODO: Do I determine type here, or in the main collection?

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

playerFDSchema.methods.getAttribute = function(attribute, cb) {
  return this.model('PlayerFD').find({});
};

module.exports = mongoose.model('PlayerFD', playerFDSchema);
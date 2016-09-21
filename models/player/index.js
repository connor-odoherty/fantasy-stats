var mongoose = require('mongoose');
var _ = require('lodash');

// Do I pull in as is? Or transform as I pull?

// TODO: Decide explicit deifinition vs flexible stat logging 
// TODO: Do I determine type here, or in the main collection?
// TODO: Add createDate
// Discuss how to handle future updates
// Maybe random ID gen upon having neither
// Will eventually not need to pull in all data every update

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

/* combineAndUpdate
 *
 * Defines logic for taking in multiple data sources and merging them
 * into a single collection
 *
 * TODO: Take in list and define priorities through config
 */
playerSchema.statics.combineAndUpdate = function(pFD, pFFN, callback) {
  var cleanFD = _.omitBy( pFD, (v) => !v );
  var cleanFFN = _.omitBy( pFFN, (v) => !v );
  var query = { player_id: pFD.player_id };
  var update = _.assign({}, cleanFFN, cleanFD);
  var options = { upsert: true, new: true, setDefaultsOnInsert: true };
  this.findOneAndUpdate(query, update, options, function(err, result) {
    if (err) {
      console.log('Unable to update player:', query);
      callback(err);
    } else {
      callback(err, result);
    }
  });
};

module.exports = mongoose.model('Player', playerSchema);
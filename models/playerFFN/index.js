var mongoose = require('mongoose');
var INFO = require('./constants/info');
var INFO_MAIN = require('../player/constants/info');
var PLAYER = require('../../constants/playerInfo');
var dataHelpers = require('../../dataHelpers/dataHelpers');
// TODO: Add middleware verifying that team and position match constants
// TODO: Add middleware to transform data to meet generic definition
// Might want to have a constants map instead

var playerFFNSchema = new mongoose.Schema({
  playerId: { type: String, unique: true, index: true },
  active: { type: Boolean },
  jersey: { type: Number},
  displayName: { type: String },
  lname: { type: String },
  fname: { type: String },
  position: { type: String },
  team: { type: String, default: 'FA' },
  number: { type: Number },
  height: { type: String },
  weight: { type: Number},
  dob: { type: String },
  college: { type: String }
});

playerFFNSchema.statics.matchAttribute = function(attribute, value, callback) {
  this.findOne({ [INFO[attribute]]: value }, function(err, player) {
    callback(err, player);
  });
};

playerFFNSchema.methods.getAttribute = function(attribute, callback) {
  return this.model('PlayerFFN').findOne({playerId: this.playerId}, function(err, value) {
    callback(err, value.toObject()[INFO[attribute]]);
  });
}

playerFFNSchema.methods.convertToMain = function(callback) {
  return this.model('PlayerFFN').findOne({playerId: this.playerId}, function(err, value) {
    callback(err, dataHelpers.convertFromTo(INFO, INFO_MAIN, value.toObject()));
  });
}

// Would make more modular, had issues with Mongoose
// Could easily port to other services and abstract
playerFFNSchema.statics.findMatch = function(playerToMatch, callback) {
  var self = this;
  playerToMatch.getAttribute(PLAYER.NAME, function(err, name) {
    self.findOne({ [INFO[PLAYER.NAME]]: name }, function(err, player) {
      if (player) {
        callback(err, player)
      } else {
        playerToMatch.getAttributes([PLAYER.LAST_NAME, PLAYER.TEAM, PLAYER.POS], function(err, atts) {
          var query = dataHelpers.convert(INFO, atts);
          console.log("QUERY FOR:", query)
          self.findOne(query, function(err, player2) {
            if (player2) {
              console.log('GOT ON SECOND PASS:', player2, playerToMatch)
              callback(player2)
            } else {
              console.log('COULD NOT FIND MATCH FOR:', playerToMatch)
              callback(null);
            }
          });
        });
      }
    });
  })
}

module.exports = mongoose.model('PlayerFFN', playerFFNSchema);
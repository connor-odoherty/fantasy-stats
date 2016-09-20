var PlayerFFN = require('./index');
var helpers = require('./helpers');
var ffnJSON = require('./ffn-players.json');
var async = require('async');

exports.loadAPI  = function(callback) {
  async.forEach(ffnJSON.Players, function (player, callback) {
    // Watch out for missmatching playerId vs PlayerID, should probably abstract to constant
    var query = { playerId: player.playerId };
    var update = helpers.transformData(player);
    var options = { upsert: true, new: true, setDefaultsOnInsert: true };
    console.log('PLAYER:', player)

    // Find the document, update if exists, add new if does not
    PlayerFFN.findOneAndUpdate(query, update, options, function(err, result) {
      err ? callback(err) : callback();
    });
  }, function(err) {
    if (err) {
      return callback(err);
    }
    // TODO: Add middleware to provide useful information to caller, 
    // like how many were added, updated, etc.
    return callback();
  }); 
}

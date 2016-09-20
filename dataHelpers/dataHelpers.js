var mongoose = require('mongoose');

// Fantasy Data tools
var fantasyDataJSON = require('../app/fantasy-data/fantasy-data-adp.json');
var helpersFD = require('../app/fantasy-data/fantasyDataHelpers');
var PlayerFD = require('../models/playerFD');

// Fantasy Football Nerds tools
var ffnJSON = require('../app/fantasy-football-nerds/ffn-players.json');
var helpersFFN = require('../app/fantasy-football-nerds/ffnHelpers');
var PlayerFFN = require('../models/playerFFN');

// REFACTOR TO ABSTRACT!!!!
// NEED TO AUTOMATICALLY GENERALIZE TEAM AND POSITION

function findPlayerMatch(player) {
  PlayerFFN.findOne({ displayName: player.Name }, function(err, playerMatch) {
    console.log('Attempt match for', player.Name, playerMatch);
    if (playerMatch) return playerMatch;
    PlayerFFN.findOne({ jersey: player.Number, team: player.Team, active: true }, function(err, playerMatch) {
      console.log('Attempt match for', player.Team, player.Number, playerMatch);
      if (playerMatch) return playerMatch;
      console.log('COULD NOT FIND MATCH FOR:', player)
      return null;
    });
  });
}

export {
  findPlayerMatch
}
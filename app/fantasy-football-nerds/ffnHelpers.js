import _ from 'lodash';

function transformData (player) {
  var playerData = {
    playerId: player.playerId,
    active: !!parseInt(player.active),
    jersey: parseInt(player.jersey),
    displayName: player.displayName,
    position: player.position,
    team: player.team,
    height: player.height,
    weight: (parseInt(player.weight)+5),
    dob: player.dob,
    college: player.college
  };
  return _.omitBy( playerData, (v) => !v );
}

export default {
  transformData
};
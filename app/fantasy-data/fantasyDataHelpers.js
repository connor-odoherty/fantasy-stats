import _ from 'lodash';

// Use some sort of assign here. Take in all the data that matches the fields,
// and then filter out what doesn't remain
const playerAttributes = [
  "PlayerId",
  "Name",
  "AverageDraftPositionPPR",
  "FirstName",
  "LastName",
  "Position",
  "Team",
  "Number",
  "ByeWeek",
  "BirthDate",
  "Height",
  "Weight"
];

function transformData (playerADP, playerInfo) {
  var pickADP = _.pick(playerADP, playerAttributes);
  var pickInfo = _.pick(playerInfo, playerAttributes);
  var playerData = _.assign({}, pickADP, pickInfo);
  return _.omitBy( playerData, (v) => !v );
}

export default {
  transformData
};
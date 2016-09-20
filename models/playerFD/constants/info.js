import INFO from '../../../constants/playerInfo';
// Middleware functions in Mongoose schema
// Possibly move to a config file system
// What to do about 1-to-many?

export default {
  [INFO.FD_PLAYER_ID]: 'playerId',
  [INFO.NAME]:         'Name',
  [INFO.ADP]:          'AverageDraftPositionPPR',
  [INFO.POS]:          'Position',
  [INFO.TEAM]:         'Team',
  [INFO.NUMBER]:       'Number',
  [INFO.BYE]:          'ByeWeek',
  [INFO.DOB]:          'BirthDate',
  [INFO.HEIGHT]:       'Height',
  [INFO.WEIGHT]:       'Weight'
}
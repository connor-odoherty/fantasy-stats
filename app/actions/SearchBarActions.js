import alt from '../alt';
import _ from 'lodash';

class SearchBarActions {
  constructor() {
    this.generateActions(
      'updateSearchQuery',
      'findPlayerSuccess',
      'findPlayerFail'
    );
  }

  findPlayer(payload) {
    $.ajax({
      url: '/api/players/search',
      data: { name: payload.searchQuery }
    })
      .done((data) => {
        _.assign(payload, data);
        this.actions.findPlayerSuccess(payload);
      })
      .fail(() => {
        this.actions.findPlayerFail(payload);
      });
  }
}

export default alt.createActions(SearchBarActions);
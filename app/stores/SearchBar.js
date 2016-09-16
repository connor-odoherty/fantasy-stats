import alt from '../alt';
import SearchBarActions from '../actions/SearchBarActions';

class SearchBarStore {
  constructor() {
    this.bindActions(SearchBarActions);
    this.searchQuery = '';
  }

  onFindPlayerSuccess(payload) {
    payload.history.pushState(null, '/players/' + payload.playerId);
  }

  onFindPlayerFail(payload) {
    setTimeout(() => {}, 1000);
  }

  onUpdateSearchQuery(event) {
    this.searchQuery = event.target.value;
  }
}

export default alt.createStore(SearchBarStore);
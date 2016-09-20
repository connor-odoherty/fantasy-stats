import alt from '../alt';
import NavbarActions from '../actions/NavbarActions';
import helpers from '../fantasy-data/fantasyDataHelpers';

class NavbarStore {
  constructor() {
    this.bindActions(NavbarActions);
    this.searchQuery = '';
    this.playerStats = {};
  }

  onUpdateSearchQuery(event) {
    this.searchQuery = event.target.value;
  }

  onLoadFantasyDataADPSuccess(data) {
    console.log('LOADED FD BY ADP!:');
  }

  onLoadFantasyDataADPFail(data) {
    console.log('FD ADP LOAD FAILED');
  }

  onLoadFantasyFootballNerdsSuccess(data) {
    console.log('LOADED FFN PLAYERS!');
  }

  onLoadFantasyFootballNerdsFail(data) {
    console.log('FFN LOAD FAILED');
  }

  onLoadCollectSuccess(data) {
    console.log('LOADED COLLECT!');
  }

  onLoadCollectFail(data) {
    console.log('LOAD COLLECT FAILED');
  }
}

export default alt.createStore(NavbarStore);
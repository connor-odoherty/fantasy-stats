import alt from '../alt';
import {assign} from 'underscore';

class NavbarActions {
  constructor() {
    this.generateActions(
      'updateSearchQuery',
      'loadFantasyDataADPSuccess',
      'loadFantasyDataADPFail',
      'loadFantasyFootballNerdsSuccess',
      'loadFantasyFootballNerdsFail',
      'loadCollectSuccess',
      'loadCollectFail'
    );
  }

  findPlayer(payload) {
    $.ajax({
      url: '/api/players/adp',
      data: { name: payload }
    })
      .done((data) => {
        console.log('json2js:', JSON.parse(data))
        this.actions.findPlayerSuccess(data)
      })
      .fail(() => {
        console.log("FIND PLAYER FAIL")
        this.actions.findPlayerFail(payload)
      });
  }

  loadFantasyDataADP() {
    $.ajax({
      url: '/fantasyDataAPI/load'
    })
      .done((data) => {
        console.log("Load FantasyData API Success")
        this.actions.loadFantasyDataADPSuccess(data)
      })
      .fail((payload) => {
        console.log("Load FantasyData API Fail", payload)
        this.actions.loadFantasyDataADPFail(payload)
      });
  }

  loadFFNPlayers() {
    $.ajax({
      url: '/ffnAPI/load'
    })
      .done((data) => {
        console.log("Load FantasyFootballNerds API Success", data)
        this.actions.loadFantasyFootballNerdsSuccess(data)
      })
      .fail((payload) => {
        console.log("Load FantasyFootballNerds API Fail", payload)
        this.actions.loadFantasyFootballNerdsFail(payload)
      });
  }

  loadCollect() {
    $.ajax({
      url: '/api/players',
      type: 'POST'
    })
      .done((data) => {
        console.log("Player Collect Success", data)
        this.actions.loadCollectSuccess(data)
      })
      .fail((payload) => {
        console.log("Player Collect Fail", payload)
        this.actions.loadCollectFail(payload)
      });
  }
}

export default alt.createActions(NavbarActions);
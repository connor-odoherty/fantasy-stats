// Babel ES6/JSX Compiler
require('babel-register');

var swig  = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var routes = require('./app/routes');
var mongoose = require('mongoose');
var _ = require('lodash');

// Request tools
var async = require('async');
var request = require('request');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config');

// Fantasy Data tools
var fantasyDataJSON = require('./models/playerFD/fantasy-data-adp.json');
var helpersFD = require('./models/playerFD/helpers');
var PlayerFD = require('./models/playerFD');

// Fantasy Football Nerds tools
var ffnJSON = require('./models/playerFFN/ffn-players.json');
var helpersFFN = require('./models/playerFFN/helpers');
var PlayerFFN = require('./models/playerFFN');
var loadFFN = require('./models/playerFFN/load');

// Helpers
var mongoHelpers = require('./dataHelpers/mongoHelpers');
// mongoHelpers.printPropertyValues();
var dataHelpers = require('./dataHelpers/dataHelpers');
var INFO = require('./constants/playerInfo');

PlayerFFN.matchAttribute(INFO.NAME, 'Corey Coleman', function(err, player) {
  console.log('PLAYER:', player)
});
var app = express();

mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('I see you forgot to run mongod again...');
});

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const FD_HEADER = { 'Ocp-Apim-Subscription-Key': 'ac747c39e87f405c8eefd6139343acef' };

/**
 * GET /api/players/search
 * Return info on a player
 */
app.get('/fantasyDataAPI/players/search', function(req, res, next) {

  var playerIdLookupUrl = 'https://api.fantasydata.net/v3/nfl/stats/JSON/Player/' + req.playerId;
  request.get({
    url: playerIdLookupUrl, 
    headers: FD_HEADER
    }, function(err, request, JSON) {
    if (err) return res.send(err);
    res.send(JSON);
  });
});

/*
 * GET /api/collect
 * Combines data from multiple sources into central DB
 * Really would like to abstract eventually
 * Don't want this coupled to specific properties
 */
app.get('/api/collect', function(req, res, next) {
  PlayerFD.find({}, function(err, documents) {
    async.forEach(documents, function(player, callback){
      var playerFFN = dataHelpers.findPlayerMatch(player);
      callback()
    }, function(err) {
      if (err) return err;
      // TODO: Middleware showing discrephancies in information
      res.send('DONE');
    })
  });
});

/**
 * GET /fantasyDataAPI/load
 * Grab all fantasy players from Fantasy Data API and save by PlayerID
 *
 * TODO:
 * - Implement a 'check set' to make sure we have loaded all players
 * - Create middleware routing (check for team name existence, player existence, etc.)
 */
app.get('/fantasyDataAPI/load', function(req, res, next) {
  // var errorIDs = [];
  async.forEach(fantasyDataJSON, function (player, callback) {
    async.waterfall([
      function(callback) {
        var playerIdLookupUrl = 'https://api.fantasydata.net/v3/nfl/stats/JSON/Player/' + player.PlayerID;
        request.get({
          url: playerIdLookupUrl, 
          headers: FD_HEADER,
          contentType: 'text/plain'
        }, function(err, request, playerJSON) {
          if (err) return callback(err);
          var parsedJSON = {};
          try {
            parsedJSON = JSON.parse(playerJSON);
          } catch (e) {
            console.log('Invalid player JSON:', player.PlayerID);
          }
          callback(err, parsedJSON);
        })
      },
      function(playerJSON) {
        // May want to make separate module
        var query = { playerId: player.PlayerID };
        var update = helpersFD.default.transformData(player, playerJSON);
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };

        // Find the document, update if exists, add new if does not
        PlayerFD.findOneAndUpdate(query, update, options, function(err, result) {
          err ? callback(err) : callback();
        });
      }
    ]);
  }, function(err) {
    if (err) {
      return res.status(500).send({message: err});
    }
    // Could add layer of data verification (clean update, no loss, logging, etc.)
    res.send('DONE');
  });
});

/**
 * GET /ffnAPI/load
 * Grab all fantasy players from Fantasy Football Nerds API and save by PlayerID
 */
app.get('/ffnAPI/load', function(req, res, next) {
  loadFFN.loadAPI(function(err) {
    err ? res.status(500).send(err.message) : res.send('LOADED');
  });
});


app.use(function(req, res) {
  Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
      var page = swig.renderFile('views/index.html', { html: html });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});

var server = require('http').createServer(app);

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));






























});
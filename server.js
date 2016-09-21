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

// Models
var Player = require('./models/player');
var helpersFD = require('./models/playerFD/helpers');
var PlayerFD = require('./models/playerFD');
var fantasyDataJSON = require('./models/playerFD/fantasy-data-adp.json');

// Fantasy Football Nerds tools
var PlayerFFN = require('./models/playerFFN');
var loadFFN = require('./models/playerFFN/load');

var INFO = require('./constants/playerInfo');

var app = express();

// Connect to MongoDB instance using Mongoose
mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('I see you forgot to run mongod again...');
});

// Configure app tools
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Move to individual service
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
 * Could easily abstract to take in list of DBs
 */
app.get('/api/collect', function(req, res, next) {
  var playerFD, playerFFN;
  PlayerFD.find({}, function(err, collection) {  
    // Iterate through each player in the FD collection
    async.forEach(collection.slice(1,5), function(player, callback) {  
      PlayerFFN.findMatch(player, function(err, playerMatch) {
        // Get the 'scrubbed' version of each API data 
        // TODO: Make this a more generic iteration of servcies
        async.parallel([
          function(callback) {
            if (playerMatch) {
              playerMatch.convertToMain(function(err, pFFN) {
                callback(err, pFFN);
              });  
            } else {
              callback()            
            }
          },
          function(callback) {
            player.convertToMain(function(err, pFD) {
              callback(err, pFD);
            });
          }
        ], function(err, results) {
          playerFD = results[1];
          playerFFN = results[0];
          Player.combineAndUpdate(playerFD, playerFFN, function(err, result) {
            callback(err, result);
          });
        })
      });
    }, function(err, result) {
      if (err) return err;
      // TODO: Middleware showing discrephancies in information
      res.send(result);
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
 * - Ability to turn logging on and off
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
        // May want to make separate module for re-use
        var query = { playerId: player.PlayerID };
        var update = helpersFD.default.transformData(player, playerJSON);
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };

        // Find the document, update if exists, add new if does not
        // TODO: consider db check middleware
        PlayerFD.findOneAndUpdate(query, update, options, function(err, result) {
          if (err) {
            console.log('Error updating::', query);
            callback(err);
          } else {
            callback();
          }
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
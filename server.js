// Babel ES6/JSX Compiler
require('babel-register');

var swig  = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var routes = require('./app/routes');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config');

var mongoose = require('mongoose');

// Fantasy Data tools
var fantasyDataJSON = require('./app/fantasy-data/fantasy-data-adp.json');
var helpersFD = require('./app/fantasy-data/fantasyDataHelpers');
var PlayerFD = require('./models/playerFD');

// Fantasy Football Nerds tools
var ffnJSON = require('./app/fantasy-football-nerds/ffn-players.json');
var helpersFFN = require('./app/fantasy-football-nerds/ffnHelpers');
var PlayerFFN = require('./models/playerFFN');

// Request parsing tools
var async = require('async');
var request = require('request');
var xml2js = require('xml2js');

// Helpers
var mongoHelpers = require('./dataHelpers/mongoHelpers');


var _ = require('lodash');

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


/**
 * GET /fantasyDataAPI/load
 * Grab all fantasy players from Fantasy Data API and save by PlayerID
 *
 * TODO:
 * - Find a way to easily combine ADP and Player info
 * - Implement a 'check set' to make sure we have loaded all players
 * - Create middleware routing (check for team name existence, player existence, etc.)
 * use 'disctint' to get each value
 * BIG ISSUE:
 * JSON parse not working correctly
 */
app.get('/fantasyDataAPI/load', function(req, res, next) {
  var errorIDs = [];
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
        var query = { playerId: player.PlayerID };
        var update = helpersFD.default.transformData(player, playerJSON);
        console.log('update:', update)
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
    res.send('DONE');
  });
});

/**
 * GET /fantasyFootballNerdsAPI/load
 * Grab all fantasy players from Fantasy Football Nerds API and save by PlayerID
 */
app.get('/ffnAPI/load', function(req, res, next) {
  async.forEach(ffnJSON.Players, function (player, callback) {
    // Watch out for missmatching playerId vs PlayerID, should probably abstract to constant
    var query = { playerId: player.playerId };
    var update = helpersFFN.default.transformData(player);
    var options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Find the document, update if exists, add new if does not
    PlayerFFN.findOneAndUpdate(query, update, options, function(err, result) {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    });
  }, function(err) {
    if (err) {
      return res.status(500).send({message: err});
    }
    res.send('DONE')
  });
});

/*
 * POST /api/players
 * Collects and cleans player data from multiple APIs into central API
 *
 * TODO:
 * - Create process for matching names (possibly keep track in set)
 * - Process for combining multiple APIs
 * - Validation
 */
app.post('/api/players', function(req, res, next) {
  PlayerFD.find({}, function (err, players) {
    if (err) return next(err);
    console.log('PLAYERS:', players)
    res.send('SUCCESS in combining players')
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

/**
 * Socket.io stuff.
 */
var server = require('http').createServer(app);

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
// Babel ES6/JSX Compiler
require('babel-register');

var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var React = require('react');
var ReactDOM = require('react-dom/server');
var swig  = require('swig');
var Router = require('react-router');
var express = require('express');
var mongoose = require('mongoose');

var async = require('async');
var request = require('request');
var xml2js = require('xml2js');

var config = require('./config');
var routes = require('./app/routes');
var Player = require('./models/player');

// Connection to MongoDB
mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('You forgot to run MongoDB again, didnt you?');
});

// Express middleware
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

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

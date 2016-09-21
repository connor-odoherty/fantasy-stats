var mongoose = require('mongoose');

// Fantasy Data tools
var PlayerFD = require('../models/playerFD');
var PlayerFFN = require('../models/playerFFN');

// Need heavier validation on convert
var convert = function(toInfo, oldObj) {
  var newObj = {};
  for (var key in oldObj) {
    newObj[ toInfo[key] ] = oldObj[key]
  };
  return newObj;
}

var convertFromTo = function(fromInfo, toInfo, oldObj) {
  var newObj = {};
  for (var key in toInfo) {
    newObj[ toInfo[key] ] = oldObj[ fromInfo[key] ]
  };
  return newObj;
}

export {
  convert,
  convertFromTo
}
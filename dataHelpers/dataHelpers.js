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
  console.log('from:', fromInfo)
  console.log('to:', toInfo)
  console.log('obj', oldObj)
  var newObj = {};
  for (var key in toInfo) {
    console.log('from key:', fromInfo[key])
    newObj[ toInfo[key] ] = oldObj[ fromInfo[key] ]
  };
  console.log('newObj:', newObj)
  return newObj;
}

export {
  convert,
  convertFromTo
}
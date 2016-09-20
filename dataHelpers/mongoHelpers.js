// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db

function getPropertyValues(collectionName, property) {
  MongoClient.connect("mongodb://localhost:27017/nef", function(err, db) {
    if(!err) {
      console.log("We are connected");
    }
    var collection = db.collection(collectionName, function(err, collection) {
      if (err) console.log('Collection invalid:', err);
      collection.distinct(property, function(err, entries) {
        err ? console.log('Property invalid:', err) : console.log(collectionName, property, entries);
      });
    });
  });
}

function printPropertyValues() {
  getPropertyValues('playerffns', 'team');
  getPropertyValues('playerffns', 'position');
  getPropertyValues('playerfds', 'team');
  getPropertyValues('playerfds', 'position');
}

export {
  getPropertyValues,
  printPropertyValues
};


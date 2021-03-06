'use strict';

const clearCollections = require('../clear-collections');

function truncate(collection) {
  return new Promise(function (resolve, reject) {
    collection.remove({}, function (err) {
      if (err && err.message !== 'ns not found') {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = function(mongoose) {
  return clearCollections(mongoose, truncate);
};


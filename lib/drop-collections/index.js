'use strict';

const clearCollection = require('../clear-collections');

function drop(collection) {
  return new Promise(function (resolve, reject) {
    collection.drop(function (err) {
      if (err && err.message !== 'ns not found') {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = function(mongoose) {
  return clearCollection(mongoose, drop);
};


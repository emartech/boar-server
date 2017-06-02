'use strict';

class TruncateCollection {

  constructor(mongoose) {
    this._mongoose = mongoose;
  }


  truncate() {
    const truncateCollections = this._collectionNames
      .map(collectionName => this._collections[collectionName])
      .map(this._truncateCollection);

    return Promise.all(truncateCollections);
  }


  _truncateCollection(collection) {
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


  get _collectionNames() {
    return Object.keys(this._mongoose.connection.collections);
  }


  get _collections() {
    return this._mongoose.connection.collections;
  }
}

module.exports = function(mongoose) {
  const truncater = new TruncateCollection(mongoose);

  return truncater.truncate.bind(truncater);
};


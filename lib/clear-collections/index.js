'use strict';

class ClearCollection {

  constructor(mongoose) {
    this._mongoose = mongoose;
    this.clear = this.clear.bind(this);
  }


  clear() {
    let clearCollections = this._collectionNames
      .map((collectionName) => this._collections[collectionName])
      .map((collection) => this._dropCollection(collection));

    return Promise.all(clearCollections);
  }


  _dropCollection(collection) {
    return new Promise(function (resolve, reject) {
      collection.drop(function (err) {
        if (err && err.message !== 'ns not found') reject(err);
        resolve();
      });
    })
  }


  get _collectionNames() {
    return Object.keys(this._mongoose.connection.collections);
  }


  get _collections() {
    return this._mongoose.connection.collections;
  }

}

module.exports = function(mongoose) {
  return (new ClearCollection(mongoose)).clear;
};



'use strict';

class ClearCollection {

  constructor(mongoose, clearFn) {
    this._mongoose = mongoose;
    this._clearFn = clearFn;
  }


  clear() {
    let clearCollections = this._collectionNames
      .map(collectionName => this._collections[collectionName])
      .map(this._clearFn);

    return Promise.all(clearCollections);
  }


  get _collectionNames() {
    return Object.keys(this._mongoose.connection.collections);
  }


  get _collections() {
    return this._mongoose.connection.collections;
  }

}

module.exports = function(mongoose, clearFn) {
  const clearer = new ClearCollection(mongoose, clearFn);

  return clearer.clear.bind(clearer);
};



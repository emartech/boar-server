'use strict';

class ClearGridfs {

  constructor(mongoose) {
    this._mongoose = mongoose;
    this.clear = this.clear.bind(this);
  }


  clear() {
    return this
      ._names()
      .then((names) => this._unlink(names));
  }


  _names() {
    return new Promise(function(resolve, reject) {
      this._GridStore.list(this._db, (err, names) => {
        if (err) return reject(err);
        resolve(names);
      });
    }.bind(this));
  }


  _unlink(names) {
    if (!names.length) return Promise.resolve();

    return new Promise(function(resolve, reject) {
      this._GridStore.unlink(this._db, names, function(error, result) {
        if (error) reject(error);
        resolve(result);
      });
    }.bind(this));
  }


  get _GridStore() {
    return this._mongoose.mongo.GridStore;
  }


  get _db() {
    return this._mongoose.connection.db;
  }

}

module.exports = function(mongoose) {
  return (new ClearGridfs(mongoose)).clear;
};

'use strict';

const expect = require('chai').expect;
const dropCollections = require('./');
const helper = require('../clear-collections/spec.helper');

describe('Drop collections', function () {
  it('should call drop on collections', function*() {
    const dropped = [];
    const droppingCollection = function (name) {
      return {
        drop: function (callback) {
          dropped.push(name);
          callback();
        }
      };
    };
    const mongoose = helper.mongoose.withCollectionFactory(droppingCollection);

    yield dropCollections(mongoose)();

    expect(dropped).to.eql(helper.collectionNames)
  });
});


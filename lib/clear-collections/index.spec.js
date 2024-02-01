'use strict';

const expect = require('chai').expect;
const clearCollections = require('.');
const helper = require('./spec.helper');
const co = require('co');

describe('ClearCollections', function () {
  it('should use the supplied clear function to clear all collections', co.wrap(function* () {
    const cleared = [];
    const clearFn = collection => cleared.push(collection.name)

    yield clearCollections(helper.mongoose, clearFn)();

    expect(cleared).to.eql(helper.collectionNames);
  }));
});

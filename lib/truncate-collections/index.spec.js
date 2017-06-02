'use strict';

const expect = require('chai').expect;
const truncateCollections = require('./');
const helper = require('../clear-collections/spec.helper');

describe('Truncate collections', function () {
  it('should truncate collections', function*() {
    const truncated = [];
    const truncatingCollection = function (name) {
      return {
        remove: function (criteria, callback) {
          expect(criteria).to.eql({})
          truncated.push(name);
          callback();
        }
      };
    };
    const mongoose = helper.mongoose.withCollectionFactory(truncatingCollection);

    yield truncateCollections(mongoose)();

    expect(truncated).to.eql(helper.collectionNames);
  });
});


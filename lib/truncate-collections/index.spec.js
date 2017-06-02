'use strict';

const expect = require('chai').expect;
const truncateCollections = require('./');

describe('Truncate collections', function () {
  it('should truncate all collections', function*() {
    const collectionNames = ['collectionA', 'collectionB'];
    const truncated = [];

    const mongoose = {
      connection: {
        collections: {
          collectionA: mockCollection('collectionA', truncated),
          collectionB: mockCollection('collectionB', truncated)
        }
      }
    };

    yield truncateCollections(mongoose)();

    expect(truncated).to.eql(collectionNames);
  });
});

function mockCollection(name, truncatedList) {
  return {
    remove: function (criteria, cb) {
      expect(criteria).to.eql({});
      truncatedList.push(name);
      cb();
    }
  };
}


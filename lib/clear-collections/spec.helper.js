'use strict';

const collectionNames = ['collectionA', 'collectionB'];

function defaultFactory(name) {
  return { name };
}

class Mongoose {

  constructor(collectionFactory) {
    this.connection = {
      collections: this.createCollections(collectionFactory || defaultFactory)
    }
  }


  createCollections(collectionFactory) {
    const collections = {};
    collectionNames.forEach(name => collections[name] = collectionFactory(name));

    return collections;
  }


  withCollectionFactory(collectionFactory) {
    return new Mongoose(collectionFactory);
  }
}

module.exports = {
  collectionNames,
  mongoose: new Mongoose()
};

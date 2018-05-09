'use strict';

const collectionNames = ['collectionA', 'collectionB'];

function defaultFactory(name) {
  return { name };
}

class Mongoose {

  constructor(collectionFactory) {
    if (collectionFactory === undefined) {
      collectionFactory = defaultFactory;
    }

    this.connection = {
      collections: this.createCollections(collectionFactory)
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

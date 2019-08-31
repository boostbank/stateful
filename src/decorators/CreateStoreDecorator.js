const Partitions = require("../utils/Partitions");
const uuid = require("uuid/v4");

class CreateStoreDecorator {
  constructor() {}


  onPartition(id = "", store = {}, depth = 0) {
    return Partitions.createStore(id, store, depth);
  }

  sharedPartition(store = {}, depth = 0) {
    const id = Partitions.getDefaultScope();
    return Partitions.createStore(id, store, depth);
  }
}

module.exports = CreateStoreDecorator;

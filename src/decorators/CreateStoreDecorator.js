const Partitions = require("../utils/Partitions");

class CreateStoreDecorator {
  constructor() {}


  onPartition(id = "", store = {}, depth = 0) {
    return Partitions.createStore(id, store, depth);
  }

  global(store = {}, depth = 0) {
    const id = Partitions.getDefaultScope();
    return Partitions.createStore(id, store, depth);
  }
}

module.exports = CreateStoreDecorator;

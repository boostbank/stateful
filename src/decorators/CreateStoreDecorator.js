const Partitions = require("../utils/Partitions");

class CreateStoreDecorator {
  constructor() {}

/**
 * Create a store on a partition.
 * @param {String} id 
 * @param {Object} store 
 * @param {Number} depth 
 */
  onPartition(id = "", store = {}, depth = 0) {
    return Partitions.createStore(id, store, depth);
  }

  /**
   * Create a shared global store.
   * @param {Object} store 
   * @param {Number} depth 
   */
  global(store = {}, depth = 0) {
    const id = Partitions.getDefaultScope();
    return Partitions.createStore(id, store, depth);
  }
}

module.exports = CreateStoreDecorator;

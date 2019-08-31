
const Partitions = require("../utils/Partitions");

class CreateSubStoreDecorator {
  constructor() {}

  onPartition(id = "", uid = "", store = {}, depth = 0) {
    return Partitions.createSubStore(id, uid, store, depth);
  }

  global(uid = "", store = {}, depth = 0) {
    const id = Partitions.getDefaultScope();
    return Partitions.createSubStore(id, uid, store, depth);
  }
}

module.exports = CreateSubStoreDecorator;
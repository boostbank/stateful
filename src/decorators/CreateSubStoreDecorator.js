
const Partitions = require("../utils/Partitions");

class CreateSubStoreDecorator {
  constructor() {}

  onPartition(id = "", uid = "", store = {}, depth = 0) {
    const id = uuid();
    const created = Partitions.createSubStore(uid, store, depth, id);
    return { created, id };
  }

  global(uid = "", store = {}, depth = 0) {
    const id = Partitions.getDefaultScope();
    return Partitions.createSubStore(uid, store, depth, id);
  }
}

module.exports = CreateSubStoreDecorator;
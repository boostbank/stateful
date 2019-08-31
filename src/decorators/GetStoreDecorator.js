const Partitions = require("../utils/Partitions");

class GetStoreDecorator {
  constructor() {}


  onPartition(id = "") {
    return Partitions.get(id).global;
  }

  global() {
    const id = Partitions.getDefaultScope();
    return Partitions.get(id).global;
  }
}

module.exports = GetStoreDecorator;

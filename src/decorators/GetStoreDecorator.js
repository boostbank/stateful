const Partitions = require("../utils/Partitions");
const Stateful = require('../stateful');

class GetStoreDecorator {
  constructor() {}

  /**
   * @returns {Stateful}
   */
  onPartition(id = "") {
    return Partitions.get(id).global;
  }

  /**
   * @returns {Stateful}
   */
  global() {
    const id = Partitions.getDefaultScope();
    return Partitions.get(id).global;
  }
}

module.exports = GetStoreDecorator;

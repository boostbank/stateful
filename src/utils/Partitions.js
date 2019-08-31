const Stateful = require("../stateful");
const SubStore = require("../substore");
const DEFAULT_PARTITION = "stateful-shared";

let instance = null;

/**
 * @returns {Partitions}
 */
const getInstance = () => {
  if (instance === null || instance === undefined) {
    instance = new Partitions();
  }
  return instance;
};

class Partitions {
  constructor() {
    this.partitions = {};
    this.createStore = this.createStore.bind(this);
    this.get = this.get.bind(this);
  }

  createStore(store = {}, depth = 0, id = DEFAULT_PARTITION) {
    let created = false;
    if (this.partitions[id] === undefined || this.partitions[id] === null) {
      const toCreate = new Stateful();
      toCreate.init(store, depth);
      this.partitions[id] = toCreate;
      created = this.partitions[id] === toCreate;
    }
    return created;
  }

  createSubStore(uid = "", store = {}, depth = 0, id = DEFAULT_PARTITION) {
    let created = false;
    if (this.partitions[id] === undefined || this.partitions[id] === null) {
      const toCreate = new SubStore();
      toCreate.init(uid, store, depth);
      this.partitions[id] = toCreate;
      created = this.partitions[id] === toCreate;
    }
    return created;
  }

  get(id = DEFAULT_PARTITION) {
    let store = undefined;
    if (this.partitions[id] !== undefined) {
      store = this.partitions[id];
    }
    return store;
  }

  /**
   * @static
   * @method getDefaultScope Gets default scope.
   * @returns {String}
   */
  getDefaultScope() {
    return DEFAULT_PARTITION;
  }
}

module.exports = getInstance();

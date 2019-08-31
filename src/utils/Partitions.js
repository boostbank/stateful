const Stateful = require("../stateful");
const SubStore = require("../substore");
const DEFAULT_SCOPE = "stateful-shared";

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
    this.scopes = {};
    this.createStore = this.createStore.bind(this);
    this.get = this.get.bind(this);
  }

  createStore(store = {}, depth = 0, id = DEFAULT_SCOPE) {
    let created = false;
    if (this.scopes[id] === undefined || this.scopes[id] === null) {
      const toCreate = new Stateful();
      toCreate.init(store, depth);
      this.scopes[id] = toCreate;
      created = this.scopes[id] === toCreate;
    }
    return created;
  }

  createSubStore(uid = "", store = {}, depth = 0, id = DEFAULT_SCOPE) {
    let created = false;
    if (this.scopes[id] === undefined || this.scopes[id] === null) {
      const toCreate = new SubStore();
      toCreate.init(uid, store, depth);
      this.scopes[id] = toCreate;
      created = this.scopes[id] === toCreate;
    }
    return created;
  }

  get(id = DEFAULT_SCOPE) {
    let store = undefined;
    if (this.scopes[id] !== undefined) {
      store = this.scopes[id];
    }
    return store;
  }

  /**
   * @static
   * @method getDefaultScope Gets default scope.
   * @returns {String}
   */
  getDefaultScope() {
    return DEFAULT_SCOPE;
  }
}

module.exports = getInstance();

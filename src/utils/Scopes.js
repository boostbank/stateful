const Stateful = require("../stateful");
const DEFAULT_SCOPE = "stateful-shared";

let instance = null;

/**
 * @returns {Scopes}
 */
const getInstance = () => {
  if (instance === null || instance === undefined) {
    instance = new Scopes();
  }
  return instance;
};

class Scopes {
  constructor() {
    this.scopes = {};
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
  }

  create(store = {}, depth = 0, id = DEFAULT_SCOPE) {
    let created = false;
    if (this.scopes[id] === undefined || this.scopes[id] === null) {
      const toCreate = new Stateful();
      toCreate.init(store, depth);
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

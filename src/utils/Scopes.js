const Stateful = require('../stateful');
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

  create(store = new Stateful().init({}), id = DEFAULT_SCOPE) {

  }

  get(id = DEFAULT_SCOPE) {
    
  }
}

module.exports = getInstance();

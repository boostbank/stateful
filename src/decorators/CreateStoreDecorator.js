const Scopes = require("../utils/Partitions");
const uuid = require("uuid/v4");

class CreateStoreDecorator {
  constructor() {}

  withScope(store = {}, depth = 0) {
    const id = uuid();
    const created = Scopes.createStore(store, depth, id);
    return { created, id };
  }

  shared(store = {}, depth = 0) {
    const id = Scopes.getDefaultScope();
    const created = Scopes.createStore(store, depth, id);
    return { created, id };
  }
}

module.exports = CreateStoreDecorator;

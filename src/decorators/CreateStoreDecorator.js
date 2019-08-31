const Scopes = require("../utils/Scopes");
const uuid = require("uuid/v4");

class CreateStoreDecorator {
  constructor() {}

  withScope(store = {}, depth = 0) {
    const id = uuid();
    const created = Scopes.create(store, depth, id);
    return { created, id };
  }

  shared(store = {}, depth = 0) {
    const id = Scopes.getDefaultScope();
    const created = Scopes.create(store, depth, id);
    return { created, id };
  }
}

module.exports = CreateStoreDecorator;

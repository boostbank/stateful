const Scopes = require("../utils/Scopes");
const uuid = require("uuid/v4");

class CreateSubStoreDecorator {
  constructor() {}

  withScope(uid = "", store = {}, depth = 0) {
    const id = uuid();
    const created = Scopes.createSubStore(uid, store, depth, id);
    return { created, id };
  }

  shared(uid = "", store = {}, depth = 0) {
    const id = Scopes.getDefaultScope();
    const created = Scopes.createSubStore(uid, store, depth, id);
    return { created, id };
  }
}

module.exports = CreateSubStoreDecorator;

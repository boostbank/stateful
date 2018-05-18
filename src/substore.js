"use strict";
const { newInstance } = require("./stateful");

let instance = undefined;

const getInstance = () => {
  if (instance === undefined) {
    instance = new SubStore();
  }
  return instance;
};

const subStores = {};

const lookup = {};

class SubStore {
  createSubStore(uid, store = {}, maxDepth = -1) {
    let subStore = undefined;
    if (typeof uid === "string") {
      const stateful = newInstance();
      subStore = stateful.createStore(store, maxDepth);
      lookup[uid] = uid;
      subStores[uid] = subStore;
    }
    return subStore;
  }

  deleteSubStore(uid) {
    let deleted = false;
    if (typeof uid === "string") {
      if (subStores.hasOwnProperty(uid)) {
        delete subStores[uid];
        deleted = !subStores.hasOwnProperty(uid);
      }
    }
    return deleted;
  }

  lookup(looker) {
    if (typeof looker === "function") {
      looker(Object.assign({}, lookup));
    }
    return Object.assign({}, lookup);
  }

  subModify(uid, modifier) {
    if (typeof uid === "string") {
      if (subStores.hasOwnProperty(uid)) {
        subStores[uid].modify(modifier);
      }
    }
  }

  subscribeTo(uid, callback) {
    if (typeof uid === "string") {
      if (subStores.hasOwnProperty(uid)) {
        subStores[uid].subscribe(callback);
      }
    }
  }

  unsubscribeFrom(uid) {
    if (typeof uid === "string") {
      if (subStores.hasOwnProperty(uid)) {
        subStores[uid].unsubscribe(callback);
      }
    }
  }

  subClear(uid) {
    if (typeof uid === "string") {
      if (subStores.hasOwnProperty(uid)) {
        subStores[uid].clear();
      }
    }
  }

  getSubState(uid) {
    let state = undefined;
    if (typeof uid === "string") {
      if (subStores.hasOwnProperty(uid)) {
        state = Object.assign({}, subStores[uid].currentStore);
      }
    }
    return state;
  }
}

module.exports = getInstance();

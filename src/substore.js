"use strict";
const { newInstance } = require("./stateful");
const copy = require('./copy');

let instance = undefined;

const subStores = {};

const lookup = {};

const isValid = uid => {
  return typeof uid === "string" && uid.length > 0;
};

class SubStore {
  createSubStore(uid = undefined, store = {}, maxDepth = -1) {
    let subStore = undefined;
      if (!isValid(uid)) {
        throw new Error("UID must be a string with at least 1 character.");
      }
      if (subStores.hasOwnProperty(uid)) {
        throw new Error("That store already exists!");
      }
      const stateful = newInstance();
      subStore = stateful.createStore(store, maxDepth);
      lookup[uid] = uid;
      subStores[uid] = subStore;
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
      looker(copy(lookup));
    }
    return copy(lookup);
  }

  hasSubStore(uid) {
    let has = false;

    if (typeof uid === "string") {
      has = subStores.hasOwnProperty(uid);
    }

    return has;
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

  unsubscribeFrom(uid, callback) {
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

  subRollback(uid) {
    if (typeof uid === "string") {
      if (subStores.hasOwnProperty(uid)) {
        subStores[uid].rollback();
      }
    }
  }

  getSubState(uid) {
    let state = undefined;
    if (typeof uid === "string") {
      if (subStores.hasOwnProperty(uid)) {
        state = copy(subStores[uid].currentStore);
      }
    }
    return state;
  }
}

module.exports = SubStore;

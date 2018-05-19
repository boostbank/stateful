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

const checkForNumber = uid => {
  const number = Number.parseInt(uid.charAt(0));
  if (!Number.isNaN(number)) {
    throw new Error("First character cannot start with number!");
  }
};

const isValid = uid => {
  return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(uid);
};

class SubStore {
  createSubStore(uid, store = {}, maxDepth = -1) {
    let subStore = undefined;
    if (typeof uid === "string" && uid.length > 0) {
      checkForNumber(uid);
      if (!isValid(uid)) {
        throw new Error("UID cannot contain special characters!");
      }
      if (subStores.hasOwnProperty(uid)) {
        throw new Error("That store already exists!");
      }
      const stateful = newInstance();
      subStore = stateful.createStore(store, maxDepth);
      lookup[uid] = uid;
      subStores[uid] = subStore;
    } else {
      throw new Error("You must pass a unique identifier!");
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

"use strict";
const Stateful = require("./stateful");
const copy = require('./copy');

const isValid = uid => {
  return typeof uid === "string" && uid.length > 0;
};

class SubStore {

  constructor(){
    this.subStores = {};
    this.lookup = {};
  }

  init(uid = undefined, store = {}, maxDepth = -1) {
    let subStore = undefined;
      if (!isValid(uid)) {
        throw new Error("UID (subStoreId) must be a string with at least 1 character.");
      }
      if (this.subStores.hasOwnProperty(uid)) {
        throw new Error("That store already exists!");
      }
      const stateful = new Stateful();
      subStore = stateful.init(store, maxDepth);
      this.lookup[uid] = uid;
      this.subStores[uid] = subStore;
    return subStore;
  }

  deleteSubStore(uid) {
    let deleted = false;
    if (typeof uid === "string") {
      if (this.subStores.hasOwnProperty(uid)) {
        delete this.subStores[uid];
        deleted = !this.subStores.hasOwnProperty(uid);
      }
    }
    return deleted;
  }

  lookup(looker) {
    if (typeof looker === "function") {
      looker(copy(this.lookup));
    }
    return copy(this.lookup);
  }

  hasSubStore(uid) {
    let has = false;

    if (typeof uid === "string") {
      has = this.subStores.hasOwnProperty(uid);
    }

    return has;
  }

  subModify(uid, modifier) {
    if (typeof uid === "string") {
      if (this.subStores.hasOwnProperty(uid)) {
        this.subStores[uid].modify(modifier);
      }
    }
  }

  subscribeTo(uid, callback) {
    if (typeof uid === "string") {
      if (this.subStores.hasOwnProperty(uid)) {
        this.subStores[uid].subscribe(callback);
      }
    }
  }

  unsubscribeFrom(uid, callback) {
    if (typeof uid === "string") {
      if (this.subStores.hasOwnProperty(uid)) {
        this.subStores[uid].unsubscribe(callback);
      }
    }
  }

  subClear(uid) {
    if (typeof uid === "string") {
      if (this.subStores.hasOwnProperty(uid)) {
        this.subStores[uid].clear();
      }
    }
  }

  subRollback(uid) {
    if (typeof uid === "string") {
      if (this.subStores.hasOwnProperty(uid)) {
        this.subStores[uid].rollback();
      }
    }
  }

  getSubState(uid) {
    let state = undefined;
    if (typeof uid === "string") {
      if (this.subStores.hasOwnProperty(uid)) {
        state = copy(this.subStores[uid].currentStore);
      }
    }
    return state;
  }
}

module.exports = SubStore;

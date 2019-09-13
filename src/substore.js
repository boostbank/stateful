"use strict";
const { newInstance } = require("./stateful");
const copy = require('./copy');

let instance = undefined;

/**
 * @returns {SubStore}
 */
const getInstance = () => {
  if (instance === undefined) {
    instance = new SubStore();
  }
  return instance;
};

const subStores = {};

const lookup = {};

const isValid = uid => {
  return typeof uid === "string" && uid.length > 0;
};

class SubStore {

  constructor(){
    this.createSubStore = this.createSubStore.bind(this);
    this.deleteSubStore = this.deleteSubStore.bind(this);
    this.lookup = this.lookup.bind(this);
    this.hasSubStore = this.hasSubStore.bind(this);
    this.subModify = this.subModify.bind(this);
    this.subModifyAsync = this.subModifyAsync.bind(this);
    this.subscribeTo = this.subscribeTo.bind(this);
    this.unsubscribeFrom = this.unsubscribeFrom.bind(this);
    this.subClear = this.subClear.bind(this);
    this.subRollback = this.subRollback.bind(this);
    this.getSubState = this.getSubState.bind(this);
  }

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

  subModify(uid, modifier, callback, who) {
    if (typeof uid === "string") {
      if (subStores.hasOwnProperty(uid)) {
        subStores[uid].modify(modifier, callback, who);
      }
    }
  }

  subModifyAsync(who, uid, modifier, callback){
    this.subModify(uid, modifier, callback, who);
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

  subRollback(uid, callback, who) {
    if (typeof uid === "string") {
      if (subStores.hasOwnProperty(uid)) {
        subStores[uid].rollback(callback, who);
      }
    }
  }

  subRollbackAsync(who, uid, callback){
    this.subRollback(uid, callback, who);
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

module.exports = getInstance();

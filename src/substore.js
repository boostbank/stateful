"use strict";
const { newInstance } = require("./stateful");
const copy = require("./copy");

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

/**
 * A class representing a collection of separated states.
 */
class SubStore {
  constructor() {
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

  /**
   * Creates a substore.
   * @param {string} uid Unique identifier to reference the substore.
   * @param {object} store The blueprint or initial state of the store.
   * @param {number} maxDepth The max states to save. Default = 0 (Means it will only save the current and not keep a history).
   */
  createSubStore(uid = undefined, store = {}, maxDepth = 0) {
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

  /**
   * Deletes a substore.
   * @param {string} uid Unique identifier to reference the substore.
   */
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

  /**
   * Looks up a substore (Decorated syntax)
   * @param {Function} looker
   */
  lookup(looker) {
    if (typeof looker === "function") {
      looker(copy(lookup));
    }
    return copy(lookup);
  }

  /**
   * Determines if a substore exists.
   * @param {string} uid Unique identifier to reference the substore.
   */
  hasSubStore(uid) {
    let has = false;

    if (typeof uid === "string") {
      has = subStores.hasOwnProperty(uid);
    }

    return has;
  }

  /**
   * Modifies a substore.
   * @param {string} uid Unique identifier to reference the substore.
   * @param {Function} modifier Modifier function ex* store=>{}
   */
  subModify(uid, modifier, callback, who) {
    if (typeof uid === "string") {
      if (subStores.hasOwnProperty(uid)) {
        subStores[uid].modify(modifier, callback, who);
      }
    }
  }

  /**
   *
   * @param {*} who
   * @param {*} uid
   * @param {*} modifier
   * @param {*} callback
   */
  subModifyAsync(who, uid, modifier, callback) {
    this.subModify(uid, modifier, callback, who);
  }

  /**
   * Snapshots a substore.
   * @param {string} uid Unique identifier to reference the substore.
   */
  subSnapshot(uid) {
    if (typeof uid === "string") {
      subStores[uid].snapshot();
    }
  }

  /**
   * Gets the current snapshot of a substore.
   * @param {string} uid Unique identifier to reference the substore.
   * @returns {Object} current snapshot of a specific substore.
   */
  getSubSnapshot(uid) {
    let snapshot = null;
    if (typeof uid === "string") {
      snapshot = subStores[uid].getSnapshot();
    }
    return snapshot;
  }

  /**
   * Modifies state and saves a snapshot.
   * @param {function} modifier Modifier function
   */
  subModifyAndSnapshot(modifier, callback = undefined, who = undefined) {
    if (typeof uid === "string") {
      subStores[uid].modifyAndSnapshot(modifier, callback, who);
    }
  }

  /**
   * Same as modifyAndSnapshot, but decorated for ease of use. (Saves a snapshot)
   * @param {*} who The object or identifier that is modifying.
   * @param {function} modifier The modifier function.
   * @param {function} callback The async callback function when done.
   */
  subModifyAndSnapshotAsync(who, modifier, callback) {
    if (typeof uid === "string") {
      subStores[uid].subModifyAndSnapshotAsync(who, modifier, callback);
    }
  }

  /**
   * Rolls state back to last saved snapshot.
   */
  subRollbackToSnapshot(callback = undefined, who = undefined){
    if (typeof uid === "string") {
      subStores[uid].rollbackToSnapshot(callback, who);
    }
  }

    /**
   * Rolls state back to last saved snapshot async.
   * @param {*} who The object or identifier that is modifying. 
   * @param {function} callback The async callback function when done.
   */
  subRollbackToSnapshotAsync(who, callback){
    if (typeof uid === "string") {
      subStores[uid].rollbackToSnapshotAsync(who, callback);
    }
  }

  /**
   * Subscribe to a substore.
   * @param {string} uid Unique identifier to reference the substore.
   * @param {Function} callback Notifier callback when state changes.
   */
  subscribeTo(uid, callback) {
    if (typeof uid === "string") {
      if (subStores.hasOwnProperty(uid)) {
        subStores[uid].subscribe(callback);
      }
    }
  }

  /**
   *
   * @param {*} uid
   * @param {*} callback
   */
  unsubscribeFrom(uid, callback) {
    if (typeof uid === "string") {
      if (subStores.hasOwnProperty(uid)) {
        subStores[uid].unsubscribe(callback);
      }
    }
  }

  /**
   * Clears a substore.
   * @param {string} uid Unique identifier to reference the substore.
   */
  subClear(uid) {
    if (typeof uid === "string") {
      if (subStores.hasOwnProperty(uid)) {
        subStores[uid].clear();
      }
    }
  }

  /**
   * Rolls back a substore to the last history item.
   * @param {string} uid Unique identifier to reference the substore.
   */
  subRollback(uid, callback = undefined, who = undefined) {
    if (typeof uid === "string") {
      if (subStores.hasOwnProperty(uid)) {
        subStores[uid].rollback(callback, who);
      }
    }
  }

  subRollbackAsync(who, uid, callback) {
    this.subRollback(uid, callback, who);
  }

  /**
   * Gets the current state of a specific substore.
   * @param {string} uid Unique identifier to reference the substore.
   * @returns {Object} current state of a specific substore.
   */
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

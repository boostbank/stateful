"use strict";

const OBJECT = "object";
const BOOLEAN = "boolean";
const FUNCTION = "function";
const NUMBER = "number";
const STRING = "string";
const UNDEFINED = "undefined";

const deepCopy = require('./deep-copy');

let instance = undefined;

/**
 * @returns {Stateful} The singleton.
 */
const getInstance = () => {
  if (instance === undefined) {
    instance = new Stateful();
  }
  return instance;
};


/**
 * @returns {Stateful} A new instance.
 */
const newInstance = (store = {}) => {
  return new Stateful().createStore(store);
};

const pushToStack = (states, maxDepth, newState) => {
  if (maxDepth >= 0) {
    if (states.length < maxDepth) {
      states.push(newState);
    } else {
      states.shift();
      states.push(newState);
    }
  } else {
    states.push(newState);
  }
};

const notify = (subscribers, currentStore, modifyCallback, who) => {
  for(let i = subscribers.length - 1; i >= 0; i--){
    subscribers[i](deepCopy(currentStore), whoWasModified=>{
      if(who === whoWasModified){
        modifyCallback();
      }
    });
  }
};

const notifyOne = (subscriber, currentStore, modifyCallback, who) =>{
  notify([subscriber], deepCopy(currentStore), modifyCallback, who);
};

const setState = (stateful, nextStore, modifyCallback, who, snapshot = false)=>{
  stateful.currentStore = deepCopy(nextStore);
  if(snapshot){
    stateful.snapshot();
  }
  notify(stateful.subscribers, nextStore, modifyCallback, who);
  pushToStack(stateful.states, stateful.maxDepth, nextStore)
}

/**
 * Class representing a stateful manager.
 */
class Stateful {
  constructor(currentStore = null) {
    this.currentStore = currentStore;
    this.currentSnapshot = null;
    this.maxDepth = -1;
    this.subscribers = [];
    this.states = [];
    this.createStore = this.createStore.bind(this);
    this.rollback = this.rollback.bind(this);
    this.rollbackAsync = this.rollbackAsync.bind(this);
    this.modify = this.modify.bind(this);
    this.modifyAsync = this.modifyAsync.bind(this);
    this.snapshot = this.snapshot.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);
    this.modifyAndSnapshot = this.modifyAndSnapshot.bind(this);
    this.modifyAndSnapshotAsync = this.modifyAndSnapshotAsync.bind(this);
    this.rollbackToSnapshot = this.rollbackToSnapshot.bind(this);
    this.rollbackToSnapshotAsync = this.rollbackToSnapshotAsync.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.clear = this.clear.bind(this);
    this.getState = this.getState.bind(this);
  }

  /**
   *
   * @param {object} store The state store. Defaults to an empty object.
   * @param {number} maxDepth Max number of stores to keep in memory over time. Default -1
   */
  createStore(store = {}, maxDepth = 0) {
    if (this.currentStore === null) {
      this.currentStore = deepCopy(store);
      this.maxDepth = maxDepth;
      pushToStack(this.states, this.maxDepth, this.currentStore);
    }
    return this;
  }

  /**
   * Rolls back the state by one.
   * @param {funtion} callback async callback.
   * @param {any} who Who is modifying.
   */
  rollback(callback, who) {
    if (this.states.length > 1) {

      const modifyCallback = typeof callback === "function" ? callback : ()=>{};
      if(this.states.length > 0){
        this.states.pop();
      }
      this.currentStore = this.states[this.states.length - 1];
      notify(this.subscribers, this.currentStore, modifyCallback, who);
    }
  }

  /**
   * Same as rollback but decorated for ease of use.
   * @param {*} who Who is modifying.
   * @param {function} callback  async callback.
   */
  rollbackAsync(who, callback){
    this.rollback(callback, who);
  }

  /**
   * Modifies state.
   * @param {function} modifier Modifier function
   * @param {function} callback The async callback function when done.
   * @param {*} who The object or identifier that is modifying. 
   * @param {boolean} snapshot Whether or not to snapshot.
   */
  modify(modifier, callback, who, snapshot = false) {
    if (modifier && typeof modifier === FUNCTION) {

      const modifyCallback = typeof callback === "function" ? callback : ()=>{};

      const newState = modifier(this.getState());
      if (
        newState !== this.currentStore &&
        newState !== undefined &&
        newState !== null &&
        typeof newState === OBJECT
      ) {
        setState(this, newState, modifyCallback, who, snapshot);
      }
    }
  }

  /**
   * Same as modify, but decorated for ease of use.
   * @param {*} who The object or identifier that is modifying. 
   * @param {function} modifier The modifier function.
   * @param {function} callback The async callback function when done.
   */
  modifyAsync(who, modifier, callback, snapshot = false){
    this.modify(modifier, callback, who, snapshot);
  }

  /**
   * Modifies state and saves a snapshot.
   * @param {function} modifier Modifier function
   * @param {function} callback The async callback function when done.
   * @param {*} who The object or identifier that is modifying. 
   */
  modifyAndSnapshot(modifier, callback, who){
    this.modify(modifier, callback, who, true);
  }

  /**
   * Same as modifyAndSnapshot, but decorated for ease of use. (Saves a snapshot)
   * @param {*} who The object or identifier that is modifying. 
   * @param {function} modifier The modifier function.
   * @param {function} callback The async callback function when done.
   */
  modifyAndSnapshotAsync(who, modifier, callback){
    this.modifyAsync(who, modifier, callback, true);
  }

  /**
   * Snapshots the current state.
   */
  snapshot(){
    this.currentSnapshot = deepCopy(this.currentStore);
  }

  /**
   * Gets last saved snapshot. If no snapshot returns null.
   */
  getSnapshot(){
    return this.currentSnapshot;
  }

  /**
   * Rolls state back to last saved snapshot.
   */
  rollbackToSnapshot(callback, who){
    if(this.currentSnapshot !== null){
      setState(this, this.currentSnapshot, callback, who);
    }
  }

  /**
   * Rolls state back to last saved snapshot async.
   * @param {*} who The object or identifier that is modifying. 
   * @param {function} callback The async callback function when done.
   */
  rollbackToSnapshotAsync(who, callback){
    this.rollbackToSnapshot(callback, who)
  }

  /**
   * Subscribe to store changes.
   * @param {function} subscriber
   */
  subscribe(subscriber) {
    if (subscriber && typeof subscriber === FUNCTION) {
      this.subscribers.unshift(subscriber);
      // Update subscriber with current state.
      notifyOne(subscriber, this.currentStore, ()=>{}, null);
    }
  }

  /**
   * Unsubscribe from store changes.
   * @param {function} subscriber
   */
  unsubscribe(subscriber) {
    for (let i = 0; i < this.subscribers.length; i++) {
      const currentSubscriber = this.subscribers[i];
      if (subscriber === currentSubscriber) {
        this.subscribers.splice(i, 1);
        i = this.subscribers.length;
      }
    }
  }

  /**
   * Clear entire store.
   */
  clear() {
    this.currentStore = {};
    this.states = [];
    pushToStack(this.states, this.maxDepth, this.currentStore);
  }

  /**
   * Get entire state.
   */
  getState() {
    return deepCopy(this.currentStore);
  }
}

module.exports = { getInstance, newInstance };

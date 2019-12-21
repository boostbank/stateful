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
const newInstance = () => {
  return new Stateful();
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
    subscribers[i](currentStore, whoWasModified=>{
      if(who === whoWasModified){
        modifyCallback();
      }
    });
  }
};

const notifyOne = (subscriber, currentStore, modifyCallback, who) =>{
  notify([subscriber], currentStore, modifyCallback, who);
};

/**
 * @module Stateful
 */
class Stateful {
  constructor() {
    this.currentStore = undefined;
    this.maxDepth = -1;
    this.subscribers = [];
    this.states = [];
    this.createStore = this.createStore.bind(this);
    this.rollback = this.rollback.bind(this);
    this.rollbackAsync = this.rollbackAsync.bind(this);
    this.modify = this.modify.bind(this);
    this.modifyAsync = this.modifyAsync.bind(this);
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
    if (this.currentStore === undefined) {
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

      this.states.pop();
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
   */
  modify(modifier, callback, who) {
    if (modifier && typeof modifier === FUNCTION) {

      const modifyCallback = typeof callback === "function" ? callback : ()=>{};

      const newState = modifier(this.getState());
      if (
        newState !== this.currentStore &&
        newState !== undefined &&
        newState !== null &&
        typeof newState === OBJECT
      ) {
        this.currentStore = deepCopy(newState);
        notify(this.subscribers, deepCopy(this.currentStore), modifyCallback, who);
        pushToStack(this.states, this.maxDepth, this.currentStore);
      }
    }
  }

  /**
   * Same as modify, but decorated for ease of use.
   * @param {*} who The object or identifier that is modifying. 
   * @param {function} modifier The modifier function.
   * @param {function} callback The async callback function when done.
   */
  modifyAsync(who, modifier, callback){
    this.modify(modifier, callback, who);
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
    this.subscribers = [];
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

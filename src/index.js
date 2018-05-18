"use strict";

const OBJECT = "object";
const BOOLEAN = "boolean";
const FUNCTION = "function";
const NUMBER = "number";
const STRING = "string";
const UNDEFINED = "undefined";

let instance = undefined;

const getInstance = () => {
  if (instance === undefined) {
    instance = new Stateful();
  }
  return instance;
};

const pushToStack = (states, newState) => {
  if (states.maxDepth >= 0) {
    if (states.length < states.maxDepth) {
      states.push(newState);
    }
  } else {
    states.push(newState);
  }
};

const notify = (subscribers, currentStore) => {
  subscribers.forEach(subscriber => {
    subscriber(currentStore);
  });
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
    this.modify = this.modify.bind(this);
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
  createStore(store = {}, maxDepth = -1) {
    if (this.currentStore === undefined) {
      this.currentStore = Object.assign({}, store);
      pushToStack(this.states, this.currentStore);
      this.maxDepth = maxDepth;
    }
    return this.currentStore;
  }

  /**
   * Rolls back the state by one.
   */
  rollback() {
    if (this.states.length > 1) {
      this.states.splice(this.states.length - 1, 1);
      this.currentStore = this.states[this.states.length - 1];
      notify(this.subscribers, this.currentStore);
    }
  }

  /**
   * Modifies state.
   * @param {function} modifier
   */
  modify(modifier) {
    if (modifier && typeof modifier === FUNCTION) {
      const newState = modifier(this.getState());
      if (
        newState !== this.currentStore &&
        newState !== undefined &&
        newState !== null &&
        typeof newState === OBJECT
      ) {
        this.currentStore = newState;
        notify(this.subscribers, this.currentStore);
        pushToStack(this.states, this.currentStore);
      }
    }
  }

  /**
   * Subscribe to store changes.
   * @param {function} subscriber
   */
  subscribe(subscriber) {
    if (subscriber && typeof subscriber === FUNCTION) {
      this.subscribers.push(subscriber);
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
    pushToStack(this.states, this.currentStore);
  }

  /**
   * Get entire state.
   */
  getState() {
    return Object.assign({}, this.currentStore);
  }
}

var initializer = getInstance();

module.exports = initializer;

("use strict");

const OBJECT = "object";
const BOOLEAN = "boolean";
const FUNCTION = "function";
const NUMBER = "number";
const STRING = "string";
const UNDEFINED = "undefined";

let instance = undefined;

let currentStore = undefined;

let states = [];

let subscribers = [];

const getInstance = () => {
  if (instance === undefined) {
    instance = new Stateful();
  }
  return instance;
};

const pushToStack = newState => {
  if (getInstance().maxDepth >= 0) {
    if (states.length < getInstance().maxDepth) {
      states.push(newState);
    }
  } else {
    states.push(newState);
  }
};

const notify = currentStore => {
  subscribers.forEach(subscriber => {
    subscriber(currentStore);
  });
};

/**
 * @module Stateful
 */
class Stateful {
  constructor() {
    this.maxDepth = -1;
  }

  /**
   *
   * @param {object} store The state store. Defaults to an empty object.
   * @param {number} maxDepth Max number of stores to keep in memory over time. Default -1
   */
  createStore(store = {}, maxDepth = -1) {
    if (currentStore === undefined) {
      currentStore = Object.assign({}, store);
      pushToStack(currentStore);
      getInstance().maxDepth = maxDepth;
    }
    return currentStore;
  }

  /**
   * Rolls back the state by one.
   */
  rollback() {
    if (states.length > 1) {
      states.splice(states.length - 1, 1);
      currentStore = states[states.length - 1];
      notify(currentStore);
    }
  }

  /**
   * Modifies state.
   * @param {function} modifier
   */
  modify(modifier) {
    if (modifier && typeof modifier === FUNCTION) {
      const newState = modifier(getInstance().getState());
      if (
        newState !== currentStore &&
        newState !== undefined &&
        newState !== null &&
        typeof newState === OBJECT
      ) {
        currentStore = newState;
        notify(currentStore);
        pushToStack(currentStore);
      }
    }
  }

  /**
   * Subscribe to store changes.
   * @param {function} subscriber
   */
  subscribe(subscriber) {
    if (subscriber && typeof subscriber === FUNCTION) {
      subscribers.push(subscriber);
    }
  }

  /**
   * Unsubscribe from store changes.
   * @param {function} subscriber
   */
  unsubscribe(subscriber) {
    for (let i = 0; i < subscribers.length; i++) {
      const currentSubscriber = subscribers[i];
      if (subscriber === currentSubscriber) {
        subscribers.splice(i, 1);
        i = subscribers.length;
      }
    }
  }

  /**
   * Clear entire store.
   */
  clear() {
    currentStore = {};
    states = [];
    subscribers = [];
    pushToStack(currentStore);
  }

  /**
   * Get entire state.
   */
  getState() {
    return Object.assign({}, currentStore);
  }
}

var initializer = getInstance();

module.exports = initializer;

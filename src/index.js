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

  createStore(store = {}, maxDepth = -1) {
    currentStore = Object.assign({}, store);
    pushToStack(currentStore);
    getInstance().maxDepth = maxDepth;
  }

  rollback() {
    if (states.length >= 1) {
      states.splice(states.length - 1, 1);
      currentStore = states[states.length - 1];
    }
  }

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

  subscribe(subscriber) {
    if (subscriber && typeof subscriber === FUNCTION) {
      subscribers.push(subscriber);
    }
  }

  unsubscribe(subscriber) {
    for (let i = 0; i < subscribers.length; i++) {
      const currentSubscriber = subscribers[i];
      if (subscriber === currentSubscriber) {
        subscribers.splice(i, 1);
        i = subscribers.length;
      }
    }
  }

  clear() {
    currentStore = {};
    states = [];
    pushToStack(currentStore);
  }

  getState() {
    return Object.assign({}, currentStore);
  }
}

var initializer = getInstance();

module.exports = initializer;

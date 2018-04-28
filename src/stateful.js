import { cursorTo } from "readline";

("use strict");

const OBJECT = "object";
const BOOLEAN = "boolean";
const FUNCTION = "function";
const NUMBER = "number";
const STRING = "string";
const UNDEFINED = "undefined";

let instance = undefined;

let currentStore = undefined;

const states = [];

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

/**
 * @module Stateful
 */
class Stateful {
  constructor() {
    this.maxDepth = -1;
  }

  createStore(store = {}, maxDepth = -1) {
    currentStore = { ...store };
    pushToStack(currentStore);
    getInstance().maxDepth = maxDepth;
  }

  rollback() {
    if (states.length >= 1) {
      states.splice(states.length - 1, 1);
      currentStore = states[states.length - 1];
    }
  }

  modify(modifier, payload) {
    if (modifier && typeof modifier === FUNCTION) {
      const newState = modifier(getInstance().getState(), payload);
      if (
        newState !== currentStore &&
        newState !== undefined &&
        newState !== null &&
        typeof newState === OBJECT
      ) {
        currentStore = { ...newState };
        pushToStack(currentStore);
      }
    }
  }

  clear() {
    currentStore = {};
    states = [];
    pushToStack(currentStore);
  }

  getState() {
    return { ...currentStore };
  }
}

var initializer = getInstance();

module.exports = initializer;

"use strict";

const OBJECT = "object";
const BOOLEAN = "boolean";
const FUNCTION = "function";
const NUMBER = "number";
const STRING = "string";
const UNDEFINED = "undefined";

const copy = require('./copy');

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

const notify = (subscribers, currentStore, callback) => {
  for(let i = subscribers.length - 1; i >= 0; i--){
    subscribers[i](currentStore, ()=>{
      callback();
    });
  }
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
    this.init = this.init.bind(this);
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
   * @param {number} maxDepth Max number of stores to keep in memory over time. Default 0
   */
  init(store = {}, maxDepth = 0) {
    if (this.currentStore === undefined) {
      this.currentStore = copy(store);
      this.maxDepth = maxDepth;
      pushToStack(this.states, this.maxDepth, this.currentStore);
    }
    return this;
  }

  /**
   * Rolls back the state by one.
   */
  rollback(callback) {

    if(!typeof callback === "function"){
      callback = ()=>{};
    }

    if (this.states.length > 1) {
      this.states.pop();
      this.currentStore = this.states[this.states.length - 1];
      notify(this.subscribers, this.currentStore, callback);
    }
  }

  /**
   * Modifies state.
   * @param {function} modifier
   */
  modify(modifier, callback) {

    if(!typeof callback === "function"){
      callback = ()=>{};
    }

    if (modifier && typeof modifier === FUNCTION) {
      const newState = modifier(this.getState());
      if (
        newState !== this.currentStore &&
        newState !== undefined &&
        newState !== null &&
        typeof newState === OBJECT
      ) {
        this.currentStore = newState;
        pushToStack(this.states, this.maxDepth, this.currentStore);
        notify(this.subscribers, copy(this.currentStore), callback);
      }
    }
  }

  /**
   * Subscribe to store changes.
   * @param {function} subscriber
   */
  subscribe(subscriber) {
    if (subscriber && typeof subscriber === FUNCTION) {
      this.subscribers.unshift(subscriber);
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
    return copy(this.currentStore);
  }
}

module.exports = Stateful;

"use strict";

let instance = undefined;

let currentStore = undefined;

const states = [];

const getInstance = () => {
  if (instance === undefined) {
    instance = new Stateful();
  }
  return instance;
};

/**
 * @module Stateful
 */
class Stateful {
  constructor() {
      this.maxDepth = -1;
  }

  createStore(store = {}, maxDepth = -1){
    currentStore = store;
    states.push(currentStore)
    getInstance().maxDepth = maxDepth;
  }

  getState(){
      return {...currentStore};
  }

}

var initializer = getInstance();

module.exports = initializer;

const { getInstance } = require("./stateful");
const substore = require("./substore");

const stateful = getInstance();

const {
  createStore,
  subscribe,
  unsubscribe,
  modify,
  modifyAsync,
  rollback,
  rollbackAsync,
  clear,
  getState
} = stateful;

//Sub store deconstruction

const {
  createSubStore,
  deleteSubStore,
  subscribeTo,
  unsubscribeFrom,
  subModify,
  subModifyAsync,
  subRollback,
  subRollbackAsync,
  subClear,
  hasSubStore,
  getSubState,
  lookup
} = substore;

module.exports = {
  createStore,
  subscribe,
  unsubscribe,
  modify,
  modifyAsync,
  rollback,
  rollbackAsync,
  clear,
  getState,
  createSubStore,
  deleteSubStore,
  subscribeTo,
  unsubscribeFrom,
  subModify,
  subModifyAsync,
  subRollback,
  subRollbackAsync,
  subClear,
  hasSubStore,
  getSubState,
  lookup
};

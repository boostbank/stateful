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
  snapshot,
  getSnapshot,
  rollbackToSnapshot,
  rollbackToSnapshotAsync,
  modifyAndSnapshot,
  modifyAndSnapshotAsync,
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
  subSnapshot,
  subModifyAndSnapshot,
  subModifyAndSnapshotAsync,
  subRollbackToSnapshot,
  subRollbackToSnapshotAsync,
  getSubSnapshot,
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
  snapshot,
  getSnapshot,
  rollbackToSnapshot,
  rollbackToSnapshotAsync,
  modifyAndSnapshot,
  modifyAndSnapshotAsync,
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
  subSnapshot,
  subModifyAndSnapshot,
  subModifyAndSnapshotAsync,
  subRollbackToSnapshot,
  subRollbackToSnapshotAsync,
  getSubSnapshot,
  subClear,
  hasSubStore,
  getSubState,
  lookup
};

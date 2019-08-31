const { createPartition, createStore, createSubStore, getStore } = require("./src/index");
const uuid = require('uuid/v4');

const id = uuid();
const created = createPartition(id);

if (created) {
  createStore.onPartition(id, {name: "Dallin"});
  createStore.global({});
  createSubStore.onPartition(id, "test");
  createSubStore.global("test");
  const partitionedStore = getStore.onPartition(id);
  const globalStore = getStore.global();

  partitionedStore.modify(store=>{
    store.name = "Dallin Boyce";
    return store;
  });

  globalStore.modify(store=>{
    store.test = "NO";
    return store;
  });

  console.log(getStore.global().getState());
  console.log(getStore.onPartition(id).getState());

}

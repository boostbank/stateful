const { createPartition, createStore, createSubStore } = require("./src/index");
const uuid = require('uuid/v4');

const id = uuid();
const created = createPartition(id);

if (created) {
  console.log(createStore.onPartition(id, {}));
  console.log(createStore.global({}));
  console.log(createSubStore.onPartition(id, "test"));
  console.log(createSubStore.global("test"));
}

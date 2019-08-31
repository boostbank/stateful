const { createPartition, createStore, createSubStore } = require("./src/index");

const id = "2";
const created = createPartition(id);

if (created) {
  console.log(createStore.onPartition(id, {}));
  console.log(createStore.global({}));
  console.log(createSubStore.onPartition(id, "test"));
  console.log(createSubStore.global("test"));
}

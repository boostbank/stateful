const { createPartition, createStore } = require("./src/index");

const id = "2";
const created = createPartition(id);

if (created) {
  console.log(createStore.onPartition(id, {}));
  console.log(createStore.sharedPartition({}));
}

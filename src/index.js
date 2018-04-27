const stateful = require("./stateful");

function main() {
  stateful.createStore({Test: "gay"});
  console.log(stateful.getState());
}

main();

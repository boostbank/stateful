const stateful = require("./src/index");
main();

function main() {
  stateful.createStore();
  stateful.modify(state => {
    state.test = "gay";
    return state;
  });
  stateful.modify(state => {
    state.test = "aids";
    return state;
  });
  console.log(stateful.getState());
}
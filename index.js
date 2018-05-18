const stateful = require("./src/index");
main();

function main() {
  stateful.createStore();

  stateful.subscribe(state =>{
    console.log(state);
  });

  stateful.modify(state => {
    state.test = "cool";
    return state;
  });
  stateful.modify(state => {
    state.test = "beans";
    return state;
  });
}
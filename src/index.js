const stateful = require("./stateful");

main();

function main() {
  stateful.createStore({ Test: "gay" });
  console.log(stateful.getState());
  stateful.modify(modifier, { fag: true });
  console.log(stateful.getState());
}

function modifier(currentState, payload) {
  delete currentState.Test;
  currentState.fag = payload.fag;
  return currentState;
}

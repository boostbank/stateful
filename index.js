// const stateful = require("./src/index");
// const {
//   createSubStore,
//   lookup,
//   subModify,
//   getSubState,
//   subscribeTo,
//   hasSubStore
// } = require("./src/substore");
const CreateStoreDecorator = require('./src/decorators/CreateStoreDecorator');
main();

function main() {
  // stateful.createStore({}, 2);
  // createSubStore("test");
  // console.log("Has substore:", hasSubStore(lookup().test));
  // stateful.subscribe(state => {
  //   console.log(state);
  // });

  // stateful.modify(state => {
  //   state.test = "cool";
  //   return state;
  // });
  // stateful.modify(state => {
  //   state.test = "beans";
  //   return state;
  // });
  // const registry = lookup();

  // subscribeTo(registry.test, state=>{
  //   console.log("GOT EM", state);
  // });

  // subModify(registry.test, store => {
  //   store.test = "I win";
  //   return store;
  // });

  // console.log(getSubState(registry.test));

  const decorator = new CreateStoreDecorator();
  console.log(decorator.withScope({}));
  console.log(decorator.shared());
  console.log(decorator.shared());


}

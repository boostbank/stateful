## Stateful is a global store to keep state globally.

## Installation

```sh
npm install @boostbank/stateful --save
```

## React Examples

[React Example](https://github.com/boostbank/react-stateful-example)

## Creating a global store.

```javascript
const {createStore} = require('@boostbank/stateful');

// Initial state is something that can be passed in.
// You can create a store with a max depth of rollback period.
// This means you can create a max of how many states are retained to be rolled back.
// This will allow you to keep memory more clear.
// The default maxDepth is -1 (No depth). Any number <= 0 will have no depth.
// KEEP IN MIND: That createStore can only be called once.
const withDefinedDepth = createStore({someStoreData: "Some initial store data"}, 10); // Depth of 10.
const noDepth = createStore({someStoreData: "Some initial store data"}, -1); // No depth
const default = createStore(); // Empty store object {} and No depth.
```

## Subscribing to state

```javascript
const { subscribe } = require("@boostbank/stateful");

// Subscribe is a listener handler for when the store gets changed.
// It will pass the current state in stateful. Do not modify it here.
subscribe(store => {
  console.log(store);
});
```

## Modifying State

> You may only modify state by the modify method.

```javascript
const { modify } = require("@boostbank/stateful");
// Calling modify on the Stateful store will ask for a lambda.
// The lambda will pass a copy of the current state (so you don't have to keep track of immutability)
// You modify the state and return it.
modify(store => {
  store.modifyObject = {
    message: "Added an object with with some data"
  };
  return store;
});
```

> You can also just override the stores current state as well.

```javascript
modify(store => {
  return {data: "A complete new object"};
});
```

> Override and merge.

> You can also just override the stores current state as well.

```javascript
modify(store => {
  // You can use spreading, or Object.assign();
  return {...store, data: "A complete new object"};
});
```

## Async modify

> An async modify is a way for you to get a callback when a particular listener is updated.

```javascript
const { subscribe } = require("@boostbank/stateful");

// For example a React Component.
const who = {};

// Subscribe as normal but with an added parameter.
subscribe((store, modified) => {
  console.log(store);

  // Updated something async.
  // Usually this will be done inside a component and you can do this.setState(store, ()=>{});
  who.setState(store, ()=>{
    // Notify which object was modified.
    // In this scenario some React component.
    /* If the component that originally modified the store is the component that was updated just now.
    *   Then it will notify the component when the modification completed.
    *  else
    *   Then the callback that you provide in the modifyAsync method wont be called. See next section.
    */
    modified(who);
  });
});
```

> Modify and wait for the async callback.

```javascript
  // Somewhere in your React component.

  // React import.
  import { modifyAsync } from '@boostbank/stateful';

  // Module imports
  const { modifyAsync } = require("@boostbank/stateful");

  // Somewhere else in the component it modifies the store.
  // The this keyword is referring to a React component (usually a class type)
  // So who is modifying, then modification function thats passed, then the callback.
  modifyAsync(this, store=>{
    store.data = "test";
    return store;
  }, ()=>{
    // The callback that gets called if you are the original modifier.
    // Make an API Call.
    axios.get(...);
  });

```
> This will become more apparent, in `react-stateful` and in your `React` apps;

## Rolling back state

> Rolling back the state will do exactly what you think it will.

> It will take the current state and push it off the stack and rollback to the previous.

> You can rollback until you reach the first state.

```javascript
const { rollback } = require("@boostbank/stateful");

rollback();
```

## Rolling back state async.

```javascript
const { rollbackAsync } = require("@boostbank/stateful");

const who = {};

// Same idea as modifyAsync;
rollbackAsync(who, ()=>{
  // The async callback.
});
```

## Substores
> Substores are a full version of a stateful store, but you can make smaller stores to hold a subset of data.


## Creating a substore

```javascript
const { createSubStore } = require("@boostbank/stateful");

// Optional return data.
const subStore = createSubStore("test");
// Without return.
createSubStore("test");

// With default state
// Optional return data.
const subStore = createSubStore("test", {someData: "test"});
// Without return.
createSubStore("test", {someData: "test"});
```

## Modifying a substore

> Using the example from the previous entry we created a subStore with 

> The same rules apply as previously seen in modifying a stores state.

```javascript
const { subModify } = require("@boostbank/stateful");

// Modify by the subStore by the uid you gave it. in this case we did test.
subModify("test", store=>{
  // Modify normally.

  store.someData = "newData";
  return store;
});

```

## Modifying a substore async.

> Same rules apply as previously seen in modifying a stores data.

```javascript

```

## Rolling back a substore

> Same rules apply as the previous rollback shown.

```javascript
const { subRollback } = require("@boostbank/stateful");

subRollback();
```
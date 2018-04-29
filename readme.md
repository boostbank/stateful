## Stateful is a global store to keep state globally.

## Installation

```sh
npm install @boostbank/stateful
```

## Creating a store.



## Modifying State

> You may only modify state by the modify method.

```javascript
const { modify } = require("@boostbank/stateful");
// Calling modify on the Stateful store will ask for a lambda.
// The lambda will pass a copy of the current state (so you don't have to keep track of immutability)
// You modify the state and return it.
modify(state => {
  state.modifyObject = {
    message: "Added an object with with some data"
  };
  return state;
});
```

## Subscribing to state

```javascript
const { subscribe } = require("@boostbank/stateful");

// Subscribe is a listener handler for when the store gets changed.
// It will pass a copy of the current state (so don't worry about modifying state directly);
subscribe(state => {
  console.log(state);
});
```

## Rolling back state

> Rolling back the state will do exactly what you think it will.

> It will take the current state and push it off the stack and rollback to the previous.

> You can rollback until you reach the first state.

```javascript
const { rollback } = require("@boostbank/stateful");
rollback();
```

# TL;DR

Predictable micro state manager.

## How to use

### Create store

```js
import manatea from "manatea";

// Defining a store
const timer = manatea(0);

// Defining a named store
const counter = manatea(0, "counter");
```

### Read store's value

```js
// Accessing the value
counter(); // 2;
```

### Update store's value

```js
counter(1);

counter(value => value + 1);

// Supports async functions
counter(async value => {
  await sleep(1);
  return value + 5;
});

timer((value, namedStores) => {
  const counterValue = namedStores.counter();
  // "counter" is in the store because it was previously named
  // on the opposite, "timer" won't ever be in the store.
  return value + counterValue;
});

// Every update functions return promises
counter(value => value + 1).then(value => console.log(value));
```

### Store's listeners

```js
// Add listener
const listener = counter.on(value => console.log(value));
```

### Remove store's listener

```js
listener.listening; // true
listener();
listener.listening; // false

// OR

listener.listening; // true
counter.clear();
listener.listening; // false
```

### Immutability

Every stores' value are immutable:

```js
const store = manatea([]);
store(value => value.push(1)); // Throws an error
store(value => [...value, 1]); // OKAY
```

# TL;DR

Predictable micro state manager.

This package has no dependencies and weights 538 B (329 B gzipped).

## How to use

### Create cup

```js
import { createCup } from "manatea";

// Defining a cup
const timer = createCup(0);

// Defining a named cup
const counter = createCup(0, "counter");
```

### Read cup's tea

```js
// Accessing the tea
counter(); // 2;
```

### Update cup's tea

```js
counter(1);

counter(tea => tea + 1);

// Supports async functions
counter(async tea => {
  await sleep(1);
  return tea + 5;
});

timer((tea, namedStores) => {
  const counterTea = namedStores.counter();
  // "counter" is in the cup because it was previously named
  // on the opposite, "timer" won't ever be in the cup.
  return tea + counterTea;
});

// Every update functions return promises
counter(tea => tea + 1).then(tea => console.log(tea));
```

### Store's listeners

```js
// Add listener
const listener = counter.on(tea => console.log(tea));
```

### Remove cup's listener

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

Every stores' tea are immutable:

```js
const cup = createCup([]);
cup(tea => tea.push(1)); // Throws an error
cup(tea => [...tea, 1]); // OKAY
```

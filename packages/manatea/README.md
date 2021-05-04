# TL;DR

Predictable micro state manager.

This package has no dependencies and weights less than 1kB (and less than 500B gzipped).

## How to use

### Create cup

```js
import { createCup } from 'manatea';

// Defining a cup
const counter = createCup(0);
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

counter(tea => {
  const otherTea = otherCup();
  return tea + otherTea;
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

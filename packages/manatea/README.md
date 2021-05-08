# TL;DR

Predictable micro state manager.

This package has no dependencies and weights less than 1kB (and less than 500B gzipped).

## How to use

### Create cup

```js
import { orderCup } from 'manatea';

// Defining a cup
const counter = orderCup(0);
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

### Cup's servers

```js
// Add server
const server = counter.on(tea => console.log(tea));
```

### Dismiss cup's server

```js
server.listening; // true
server();
server.listening; // false

// OR

server.listening; // true
counter.clear();
server.listening; // false
```

## TL;DR <!-- omit in toc -->

Predictable micro state manager.

This package has no dependencies and weights less than 1kB (and less than 500B gzipped).

## Table of contents <!-- omit in toc -->

1. [Lexicon](#lexicon)
2. [How to use](#how-to-use)
   1. [Create cup](#create-cup)
   2. [Read cup's tea](#read-cups-tea)
   3. [Update cup's tea](#update-cups-tea)
   4. [Cup's servers](#cups-servers)
   5. [Dismiss cup's server](#dismiss-cups-server)

## Lexicon

`Manatea` uses weird and funny names because this project is mostly for fun. And also I do whatever I want with it.

But as those can be confusing, he is an equivalent to all our names in more usual words:

First you `order a cup` of `tea` filled with your `first tea`. Then you can place a new `order` and the `server` will `refill` your `cup` with a new tea.

Depending on whether or not the tea suits you, you can add flavor to it with a `flavoring`.

| In `manatea` | More generic names | Explanation                                                                                                                                                            |
| ------------ | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orderCup`   | create store       | Create an object than can contain a value, gives access to read or modify this value, and provides a way to add listeners that will get called when the value changes. |
| `tea`        | value              | Value stored within the _cup_                                                                                                                                          |
| `firstTea`   | initial value      | Value present within the _cup_ when it was first created                                                                                                               |
| `Order`      | value setter       | When the _cup_ needs to be updated, we can either provide a new value, or a function that will give access to the current value in order to compute the new one.       |
| `teaRefill`  | new value          | New value provided to the _cup_ that will be used as the new internal value. Either the value of the _order_, or its returned value if it was a function.              |
| `flavoring`  | transformer        | When a _tea_ is passed to the _cup_, you may want to restrict it to a range of allowed values. The _flavoring_ can transformed the provided _tea_.                     |
| `server`     | listener           | When the internal _tea_ changes, _servers_ will get called with the new value.                                                                                         |

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

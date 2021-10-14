## TL;DR <!-- omit in toc -->

Predictable micro state manager.

This package has no dependencies and weights less than 1kB (and less than 500B gzipped).

## Table of contents <!-- omit in toc -->

1. [Lexicon](#lexicon)
2. [How to use](#how-to-use)
   1. [Create cup](#create-cup)
   2. [Read cup's tea](#read-cups-tea)
   3. [Update cup's tea](#update-cups-tea)
   4. [Flavoring](#flavoring)
      1. [Simple flavors](#simple-flavors)
      2. [Transformations](#transformations)
      3. [Adding flavors based on the previous flavors](#adding-flavors-based-on-the-previous-flavors)
   5. [Cup's servers](#cups-servers)
      1. [Creating a server](#creating-a-server)
      2. [Clearing a server](#clearing-a-server)

## Lexicon

`Manatea` uses weird and funny names because this project is mostly for fun. And also we can do whatever we want with it.

Here is the reason behind all our names:

> First you `order a cup` of `tea` filled with your `first tea`. Then you can place a new `order` and the `server` will `refill` your `cup` with a new tea.\
> Depending on whether or not the tea suits you, you can add flavor to it with a `flavoring`.

But as those can be confusing, he is an equivalent to all our names in more usual words:

| In `manatea`    | More generic names | Explanation                                                                                                                                                                                                                  |
| --------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orderCup`      | create store       | Create an object than can contain a value, gives access to read or modify this value, and provides a way to add listeners that will get called when the value changes.                                                       |
| `flavoredTea`   | value              | Value stored within the _cup_                                                                                                                                                                                                |
| `firstTea`      | initial value      | Value present within the _cup_ when it was first created                                                                                                                                                                     |
| `Order`         | value setter       | When the _cup_ needs to be updated, we can either provide a new value, or a function that will give access to the current value in order to compute the new one.                                                             |
| `unflavoredTea` | new value          | New value provided to the _cup_ that will be used as the new internal value (after going through the `flavoring` phase). Either the value of the _order_, or its returned value if it was a function.                        |
| `flavoring`     | transformer        | When a _unflavoredTea_ (dirty value) is passed to the _cup_, you may want to restrict it to a range of allowed values. The _flavoring_ can transformed this provided _unflavoredTea_ to a _flavoredTea_ one (a clean value). |
| `server`        | listener           | When the internal _tea_ changes, _servers_ will get called with the new value.                                                                                                                                               |

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

### Flavoring

#### Simple flavors

When a new unflavored tea is passed to cup, you may want to apply restrictions to it.

For instance, if your `flavoredTea` is a number, you may want to set bounds to it:

```js
const cup = createCup(0, unflavoredTea =>
  Math.min(10, Math.max(0, unflavoredTea)),
);

cup(12);

// clamp to 10 as we set an upper bound to 10 above
cup(); // 10
```

#### Transformations

In addition simple restrictions that have the same type as the flavored tea, you can fully transform it:

```ts
interface FlavoredTea {
  value: number;
  label: string;
}

const cup = createCup<FlavoredTea, number>(0, unflavored => {
  return {
    value: unflavored,
    label: `Value of: ${unflavored}`,
  };
});

// even the initialTea will get flavored
cup(); // { value: 0, label: 'Value of: 0' }

cup(5);

// even the initialTea will get flavored
cup(); // { value: 5, label: 'Value of: 5' }
```

#### Adding flavors based on the previous flavors

The `flavoring` function have a second parameters (not passed for the `initialTea`) that give to you the previously `flavoredTea`:

```js
const cup = createCup(
  0,
  (unflavored, previouslyFlavoredTea = 0) => unflavored + previouslyFlavoredTea,
);

cup(); // 0

cup(2);
cup(); // 2 – because 2 + 0 = 2

cup(5);
cup(); // 7 – because 5 + 2 = 7
```

### Cup's servers

#### Creating a server

```js
// Add server
const server = counter.on(tea => console.log(tea));
```

#### Clearing a server

```js
server.listening; // true
server();
server.listening; // false

// OR

server.listening; // true
counter.clear();
server.listening; // false
```

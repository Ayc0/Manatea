## TL;DR <!-- omit in toc -->

Predictable micro state manager.

This package has no dependencies and weights less than 1kB (and less than 500B gzipped).

<center>
<img width="200" alt="Manatea" src="https://raw.githubusercontent.com/Ayc0/Manatea/ocean/docs/manatea-emoji.png">
<div>
<small>Designed by <a href="https://www.anediaz.com/">Ane Diaz</a></small></div>
</center>

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
   5. [Cup's waiters](#cups-waiters)
      1. [Calling a waiter](#calling-a-waiter)
      2. [Firing a waiter](#firing-a-waiter)
   6. [Derived cup](#derived-cup)

## Lexicon

`Manatea` uses weird and funny names because this project is mostly for fun. And also we can do whatever we want with it.

Here is the reason behind all our names:

> First you `order a cup` of `tea` filled with your `first tea`. Then you can place a new `order` and the `waiter` will `refill` your `cup` with a new tea.\
> Depending on whether or not the tea suits you, you can add flavor to it with a `flavoring`.

But as those can be confusing, he is an equivalent to all our names in more usual words:

| In `manatea`    | More generic names  | Explanation                                                                                                                                                                                                                |
| --------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orderCup`      | create atom (store) | Create an object that can contain a value, gives access to read or modify this value, and provides a way to add listeners that will get called when the value changes.                                                     |
| `flavoredTea`   | value               | Value stored within the _cup_                                                                                                                                                                                              |
| `firstTea`      | initial value       | Value present within the _cup_ when it was first created                                                                                                                                                                   |
| `Order`         | value setter        | When the _cup_ needs to be updated, we can either provide a new value, or a function that will give access to the current value in order to compute the new one.                                                           |
| `unflavoredTea` | new value           | New value provided to the _cup_ that will be used as the new internal value (after going through the `flavoring` phase). Either the value of the _order_, or its returned value if it was a function.                      |
| `flavoring`     | transformer         | When a _unflavoredTea_ (dirty value) is passed to the _cup_, you may want to restrict it to a range of allowed values. The _flavoring_ can transform this provided _unflavoredTea_ to a _flavoredTea_ one (a clean value). |
| `waiter`        | listener            | When the internal _tea_ changes, _waiters_ will get called with the new value.                                                                                                                                             |

## How to use

### Create cup

```js
import { orderCup } from 'manatea';

// Define (order) a cup with a default value (tea) of 0
const cup = orderCup(0);
```

### Read cup's tea

```js
// Return current value (tea) of the cup
cup(); // 0;
```

### Update cup's tea

```js
// Set value (tea) to 1
cup(1);

// increment the stored value (tea) by 1
cup(tea => tea + 1);

// Supports async functions
// wait 1 second and then increment the tea by 5
cup(async tea => {
  await sleep(1);
  return tea + 5;
});

// You can also read from cup to set another cup's value
cup(tea => {
  const otherTea = otherCup();
  return tea + otherTea;
});
```

Every update made to a cup returns a promise:

```js
// wait for the value to be stored and dispatched
await cup(1);

// you can also use the regular .then() method
cup(tea => tea + 1).then(tea => console.log(tea));
```

### Flavoring

#### Simple flavors

When a new unflavored tea is passed to the cup, you may want to apply restrictions to it.

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

### Cup's waiters

From any cup, you can call waiters that will alert you when the tea stored in the cup changes (they are like event listeners).

#### Calling a waiter

```js
// Call the waiter
const waiter = cup.on(tea => console.log(tea));
```

#### Firing a waiter

You can fire a waiter (stop the listener) by calling it:

```js
const waiter = cup.on(console.log);
// here the waiter will be called on each update of the cup

// but by calling `waiter()`, it won't receive any update anymore
waiter();
```

### Derived cup

You can create a cup based on another one, or multiple other ones:

```js
const cup1 = orderCup(0);
const cup2 = orderCup(0);
const derivedCup = orderCup(sip => sip(cup1) + sip(cup2));

derivedCup(); // 0

await cup1(1);
await cup1(4);
derivedCup(); // 5
```

And it supports the same feature are regular cup:

- flavoring
- waiters
- it's tea can be updated

```js
const countString = orderCup('0');
const cumulatedCountNumber = orderCup(
  sip => sip(countString),
  (newValue, previousTotal = 0) => {
    return Number(newValue) + previousTotal;
  },
);

cumulatedCountNumber.on(newTotal => console.log(newTotal));
await countString('5');
cumulatedCountNumber(); // 5 (0 + 5)

// you can also call `cumulatedCountNumber` directly if you want:
await cumulatedCountNumber('12');

cumulatedCountNumber(); // 17 (5 + 12)
```

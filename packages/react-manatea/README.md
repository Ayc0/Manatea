# React-Manatea

## TL;DR

Bindings of [manatea](<[https://npmjs.](https://www.npmjs.com/package/manatea)>) for React

## Table of Contents

1.  [`infuse`](#infuse)
2.  [`Infuser`](#infuser)
3.  [`useInfuser`](#useinfuser)

## infuse

```js
import React from 'react';
import { createCup } from 'manatea';
import { infuse } from 'react-manatea';

// Defining a cup
const timer = createCup(0);

// Defining a named cup
const counter = createCup(0, 'counter');

const Timer = infuse(timer)(({ tea: time }) => <div>Time: {time}</div>);
const Counter = infuse('counter')(({ tea: count }) => (
  <div>Count: {count}</div>
));
```

## infuser

```js
import React from 'react';
import { createCup } from 'manatea';
import { Infuser } from 'react-manatea';

// Defining a cup
const timer = createCup(0);

// Defining a named cup
const counter = createCup(0, 'counter');

const Timer = () => (
  <Infuser cup={timer}>{({ tea: time }) => <div>Time: {time}</div>}</Infuser>
);
const Counter = () => (
  <Infuser cup="counter">
    {({ tea: count }) => <div>Count: {count}</div>}
  </Infuser>
);
```

## useInfuser

```js
import React, { useInfuser } from 'react';
import { createCup } from 'manatea';
import { useInfuser } from 'react-manatea';

// Defining a cup
const timer = createCup(0);

// Defining a named cup
const counter = createCup(0, 'counter');

const Timer = () => {
  const [time, setTime] = useInfuser(timer);
  return <div>Time: {time}</div>;
};
const Counter = () => {
  const [count, setCount] = useInfuser('counter');
  return <div>Count: {count}</div>;
};
```

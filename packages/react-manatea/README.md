# React-Manatea <!-- omit in toc -->

## TL;DR <!-- omit in toc -->

Bindings of [manatea](<[https://npmjs.](https://www.npmjs.com/package/manatea)>) for React

## Table of Contents <!-- omit in toc -->

1. [infuse](#infuse)
2. [Infuser](#infuser)
3. [useInfuser](#useinfuser)

## infuse

```js
import React from 'react';
import { createCup } from 'manatea';
import { infuse } from 'react-manatea';

// Defining a cup
const timer = createCup(0);

const Timer = infuse(timer)(({ tea: time }) => <div>Time: {time}</div>);
```

## Infuser

```js
import React from 'react';
import { createCup } from 'manatea';
import { Infuser } from 'react-manatea';

// Defining a cup
const timer = createCup(0);

const Timer = () => (
  <Infuser cup={timer}>{({ tea: time }) => <div>Time: {time}</div>}</Infuser>
);
```

## useInfuser

```js
import React, { useInfuser } from 'react';
import { createCup } from 'manatea';
import { useInfuser } from 'react-manatea';

// Defining a cup
const timer = createCup(0);

const Timer = () => {
  const [time, setTime] = useInfuser(timer);
  return <div>Time: {time}</div>;
};
```

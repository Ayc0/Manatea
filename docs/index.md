# Doc for Manatea libs

- [manatea](manatea.html)
- [react-manatea](react.html)

```jsx
const { createCup } = manatea;
const { Manatee, infuse } = ReactManatea;

const add = tea => Math.min(50, tea + 1);
const subtract = tea => Math.max(0, tea - 1);

// Use lib
const UnnamedCup = (() => {
  // Define store
  const counter = createCup(0);

  const increment = () => counter(add);
  const decrement = () => counter(subtract);

  return () => (
    <div>
      Unnamed counter <br />
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button> <br />
      <Manatee cup={counter}>{tea => tea}</Manatee> <br />
    </div>
  );
})();

const NamedCup = (() => {
  // Define store
  const counter = createCup(0, "counter");

  const increment = () => counter(add);
  const decrement = () => counter(subtract);

  return () => (
    <div>
      Named counter <br />
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button> <br />
      <Manatee cup="counter">{tea => tea}</Manatee> <br />
    </div>
  );
})();

const ConnectedUnnamedCup = (() => {
  // Define store
  const counter = createCup(0);

  const increment = () => counter(add);
  const decrement = () => counter(subtract);

  const component = ({ tea }) => (
    <div>
      Unnamed connected counter <br />
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button> <br />
      {tea} <br />
    </div>
  );
  return infuse(counter)(component);
})();

const ConnectedNamedCup = (() => {
  // Define store
  const counter = createCup(0, "connect");

  const increment = () => counter(add);
  const decrement = () => counter(subtract);

  const component = ({ tea }) => (
    <div>
      Named connected counter <br />
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button> <br />
      {tea} <br />
    </div>
  );
  return infuse("connect")(component);
})();

const App = () => (
  <React.Fragment>
    <UnnamedCup /> <br />
    <NamedCup /> <br />
    <ConnectedUnnamedCup /> <br />
    <ConnectedNamedCup /> <br />
  </React.Fragment>
);

ReactDOM.render(<App />, document.getElementById("root"));
```

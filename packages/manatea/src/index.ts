export type Value = null | string | number | boolean | any[] | Object | Map<any, any> | Set<any>;
export type Listener = (value: Value) => void;
interface Stores {
  [key: string]: any;
}
type Store = (value: Value, stores: Stores) => Value | Promise<Value>;

const stores: Stores = {};

const defineProperty = Object.defineProperty;

const manatea = (initialValue: Value, name?: string) => {
  let listeners = new Map();
  let value = initialValue;
  const setValue = (newValue: Value) => {
    if (newValue !== undefined && value !== newValue) {
      value = newValue;
      Object.freeze(value);
      listeners.forEach(fn => fn(value));
    }
  };

  const store = function(change: Value | Store) {
    if (arguments.length === 0) {
      return value;
    }
    if (typeof change === "function") {
      const newValue = change(value, stores);
      if (newValue instanceof Promise) {
        return newValue.then(v => {
          setValue(v);
          return value;
        });
      }
      change = newValue;
    }
    setValue(change);
    return Promise.resolve(value);
  };

  defineProperty(store, "on", {
    value: (fn: Listener) => {
      const key = listeners.size;
      listeners.set(key, fn);
      const listener = () => listeners.delete(key);
      defineProperty(listener, "listening", {
        get: () => listeners.has(key)
      });
      return listener;
    }
  });

  defineProperty(store, "clear", {
    value: () => listeners.clear()
  });

  if (name) {
    stores[name] = store;
  }
  return store;
};

export default manatea;

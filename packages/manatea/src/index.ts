export type Value = null | string | number | boolean | any[] | Object | Map<any, any> | Set<any>;
type ListenerFn = (value: Value) => void;

export interface Listener {
  (): boolean;
  listening: boolean;
}

interface Stores {
  [key: string]: any;
}

type Change = (value: Value, stores?: Stores) => Value | Promise<Value>;

export interface Store {
  (change?: Change): Value | Promise<Value>;
  on: (fn: ListenerFn) => Listener;
  clear: () => boolean;
}

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

  // @ts-ignore
  const store: Store = function(change?: Value | Change) {
    if (change === undefined) {
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
    value: (fn: ListenerFn) => {
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

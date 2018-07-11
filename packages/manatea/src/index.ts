export type Value = null | string | number | boolean | symbol | Date | any[] | object | Map<any, any> | Set<any>;
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
  (): Value;
  (change: Change): Promise<Value>;
  on: (fn: ListenerFn) => Listener;
  clear: () => boolean;
}

export const store: Stores = {};

const defineProperty = Object.defineProperty;

export const createStore = (initialValue: Value, name?: string) => {
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
  const localStore: Store = function(change) {
    if (change === undefined) {
      return value;
    }
    if (typeof change === "function") {
      const newValue = change(value, store);
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

  defineProperty(localStore, "on", {
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

  defineProperty(localStore, "clear", {
    value: () => listeners.clear()
  });

  if (name) {
    store[name] = localStore;
  }
  return localStore;
};

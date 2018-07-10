import { Key, Value, Instance, Listener } from "./instance";

interface Stores {
  [key: string]: Value;
  [key: number]: Value;
}

const stores: Stores = {};

type Change = (value: Value, stores: Stores) => any;

const defineProperty = Object.defineProperty;

const getListener = (instance: Instance, fn: Listener) => {
  const id = instance.on(fn);
  const listener = () => instance.off(id);
  defineProperty(listener, "listening", {
    get: () => instance.l(id)
  });
  return listener;
};

const getStore = (instance: Instance, name: string, enumerable: boolean) => {
  const key: Key = name || Object.getOwnPropertyNames(stores).length;
  const output = (...args: any[]) => {
    if (args.length === 0) {
      return instance.value;
    }
    let change: Value | Change = args[0];
    if (typeof change === "function") {
      // If a function is passed (value, store) => newValue
      const newValue: Value = change(instance.value, stores);
      if (newValue instanceof Promise) {
        // If this function returns a Promise, wait for the resolution
        return newValue.then((v: Value) => {
          instance.value = v;
          return instance.value;
        });
      }
      change = newValue;
    }
    instance.value = change;
    return Promise.resolve(instance.value);
  };

  defineProperty(output, "on", {
    value: (fn: Listener) => getListener(instance, fn)
  });

  defineProperty(output, "delete", {
    value: instance.delete
  });

  defineProperty(stores, key, {
    enumerable,
    value: output
  });

  return output;
};

export default getStore;

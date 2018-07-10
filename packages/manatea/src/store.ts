import { Key, Value, Instance, Listener } from "./instance";

interface Stores {
  [key: string]: Value;
  [key: number]: Value;
}

const stores: Stores = {};

type Change = (value: Value, stores: Stores) => any;

const getListener = (instance: Instance, fn: Listener) => {
  const id = instance.addListener(fn);
  const listener = () => instance.removeListener(id);
  Object.defineProperty(listener, "listening", {
    get: () => instance.listeners.has(id)
  });
  return listener;
};

const getStore = (instance: Instance, key: Key, enumerable: boolean) => {
  const output = (...args: any[]) => {
    if (args.length === 0) {
      return instance.value;
    }
    const change: Value | Change = args[0];
    if (typeof change === "function") {
      const newValue: Value = change(instance.value, stores);
      if (newValue instanceof Promise) {
        return newValue.then((v: Value) => {
          instance.value = v;
        });
      }
      instance.value = newValue;
    } else {
      instance.value = change;
    }
    return Promise.resolve();
  };

  Object.defineProperty(output, "on", {
    value: (fn: Listener) => getListener(instance, fn)
  });

  Object.defineProperty(output, "delete", {
    value: instance.delete
  });

  Object.defineProperty(stores, key, {
    enumerable,
    value: output
  });

  return output;
};

export default getStore;

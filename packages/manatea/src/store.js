const stores = {};

const getListener = (instance, fn) => {
  const id = instance.addListener(fn);
  const listener = () => instance.removeListener(id);
  Object.defineProperty(listener, "listening", {
    get: () => instance.listeners.has(id)
  });
  return listener;
};

const getStore = (instance, key, enumerable) => {
  const output = (...args) => {
    if (args.length === 0) {
      return instance.value;
    }
    const change = args[0];
    if (typeof change === "function") {
      const newValue = change(instance.value, stores);
      if (newValue instanceof Promise) {
        return newValue.then(v => {
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
    value: fn => getListener(instance, fn)
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

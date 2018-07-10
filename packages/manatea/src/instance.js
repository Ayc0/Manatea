const instances = {};

const createInstance = (name, initialValue, enumerable) => {
  const key = name || Object.getOwnPropertyNames(instances).length;
  if (key in instances) {
    throw new Error(`"${key}" is already a named store.`);
  }
  Object.defineProperty(instances, key, {
    enumerable,
    value: {
      _value: initialValue,
      get value() {
        return instances[key]._value;
      },
      set value(newValue) {
        Object.freeze(newValue);
        instances[key].listeners.forEach(fn => fn(newValue));
        return (instances[key]._value = newValue);
      },
      listeners: new Map(),
      addListener: fn => {
        const id = instances[key].listeners.length;
        instances[key].listeners.set(id, fn);
        return id;
      },
      removeListener: id => instances[key].listeners.delete(id),
      delete: () => {
        instances[key].listeners.clear();
        delete instances[key];
      }
    }
  });
  return { instance: instances[key], key };
};

export default createInstance;

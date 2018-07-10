export type Key = string | number;
export type Value = null | string | number | boolean | any[] | Object | Map<any, any> | Set<any>;
export type Listener = (value: Value) => void;

export interface Instance {
  _value: Value;
  value: Value;
  listeners: Map<number, Listener>;
  addListener: (fn: Listener) => number;
  removeListener: (id: number) => boolean;
  delete: () => void;
}

interface Instances {
  [key: number]: Instance;
  [key: string]: Instance;
}

const instances: Instances = {};

const createInstance = (name: string, initialValue: Value, enumerable: boolean) => {
  const key: Key = name || Object.getOwnPropertyNames(instances).length;
  if (key in instances) {
    throw new Error(`"${key}" is already a named store.`);
  }
  const instance: Instance = {
    _value: initialValue,
    get value() {
      return instance._value;
    },
    set value(newValue) {
      if (newValue === undefined) {
        return;
      }
      Object.freeze(newValue);
      instance.listeners.forEach((fn: Listener) => fn(newValue));
      instance._value = newValue;
    },
    listeners: new Map(),
    addListener: fn => {
      const id: number = instance.listeners.size;
      instance.listeners.set(id, fn);
      return id;
    },
    removeListener: id => instance.listeners.delete(id),
    delete: () => {
      instance.listeners.clear();
      delete instances[key];
    }
  };
  Object.defineProperty(instances, key, {
    enumerable,
    value: instance
  });
  return { instance, key };
};

export default createInstance;

export type Value = null | string | number | boolean | any[] | Object | Map<any, any> | Set<any>;
export type Listener = (value: Value) => void;

export interface Instance {
  value: Value;
  l: (id: number) => boolean;
  on: (fn: Listener) => number;
  off: (id: number) => boolean;
  delete: () => void;
}

const createInstance = (name: string, initialValue: Value) => {
  const listeners = new Map();
  let value: Value = initialValue;

  let instance: Instance | void = {
    get value() {
      return value;
    },
    set value(newValue) {
      if (newValue === undefined) {
        return;
      }
      Object.freeze(newValue);
      listeners.forEach((fn: Listener) => fn(newValue));
      value = newValue;
    },
    l: id => listeners.has(id),
    on: fn => {
      const id: number = listeners.size;
      listeners.set(id, fn);
      return id;
    },
    off: id => listeners.delete(id),
    delete: () => {
      listeners.clear();
      instance = undefined;
    }
  };

  return instance;
};

export default createInstance;

export type Tea =
  | null
  | string
  | number
  | boolean
  | symbol
  | Date
  | any[]
  | object
  | Map<any, any>
  | Set<any>;
type ListenerFn = (tea: Tea) => void;

export interface Listener {
  (): boolean;
  listening: boolean;
}

interface Store {
  [key: string]: any;
}

type Change = ((tea: Tea, store?: Store) => Tea | Promise<Tea>) | Tea;

export interface Cup {
  (): Tea;
  (change: Change): Promise<Tea>;
  on: (fn: ListenerFn) => Listener;
  clear: () => boolean;
}

export const store: Store = {};

const defineProperty = Object.defineProperty;

export const createCup = (initialTea: Tea, name?: string) => {
  let listeners = new Map();
  let tea = initialTea;
  const setTea = (newTea: Tea) => {
    if (newTea !== undefined && tea !== newTea) {
      tea = newTea;
      Object.freeze(tea);
      listeners.forEach(fn => fn(tea));
    }
  };

  // @ts-ignore
  const cup: Cup = function(change) {
    if (change === undefined) {
      return tea;
    }
    if (typeof change === 'function') {
      const newTea = change(tea, store);
      if (newTea instanceof Promise) {
        return newTea.then(v => {
          setTea(v);
          return tea;
        });
      }
      change = newTea;
    }
    setTea(change);
    return Promise.resolve(tea);
  };

  defineProperty(cup, 'on', {
    value: (fn: ListenerFn) => {
      const key = listeners.size;
      listeners.set(key, fn);
      const listener = () => listeners.delete(key);
      defineProperty(listener, 'listening', {
        get: () => listeners.has(key),
      });
      return listener;
    },
  });

  defineProperty(cup, 'clear', {
    value: () => listeners.clear(),
  });

  if (name) {
    store[name] = cup;
  }
  return cup;
};

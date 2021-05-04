export type Tea =
  | null
  | string
  | number
  | undefined
  | boolean
  | symbol
  | Date
  | any[]
  | object
  | Map<any, any>
  | Set<any>;
type ListenerFn<T extends Tea> = (tea: T) => void;

export interface Listener {
  (): boolean;
  listening: boolean;
}

interface Store {
  [key: string]: any;
}

type Change<T extends Tea> = ((tea: T, store?: Store) => T | Promise<T>) | T;

export interface Cup<T extends Tea> {
  (): T;
  (change: Change<T>): Promise<T>;
  on: (fn: ListenerFn<T>) => Listener;
  clear: () => void;
}

export const store: Store = {};

export const createCup = <T extends Tea>(initialTea: T, name?: string) => {
  let listeners = new Set<ListenerFn<T>>();
  let tea = initialTea;

  let isPreviousCancelled = { cancelled: false };

  const setTea = (newTea: T) => {
    if (tea === newTea) {
      return;
    }
    isPreviousCancelled.cancelled = true;
    const isCancelled = { cancelled: false };
    isPreviousCancelled = isCancelled;
    tea = newTea;
    listeners.forEach(fn => {
      if (isCancelled.cancelled) {
        return;
      }
      fn(tea);
    });
  };

  function cup(change: Change<T>) {
    if (arguments.length === 0) {
      return tea;
    }
    return Promise.resolve(
      typeof change === 'function' ? change(tea, store) : change,
    ).then(newTea => {
      setTea(newTea);
      return tea;
    });
  }

  cup.on = (fn: ListenerFn<T>) => {
    listeners.add(fn);
    const listener = () => listeners.delete(fn);
    Object.defineProperty(listener, 'listening', {
      get: () => listeners.has(fn),
    });
    return listener as Listener;
  };

  cup.clear = () => listeners.clear();

  if (name) {
    if (store[name]) {
      throw new Error('Cannot override existing named cup');
    }
    store[name] = cup;
  }

  return cup;
};

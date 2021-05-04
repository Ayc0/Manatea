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

type Handler<T extends Tea> = (tea: T) => void;

export interface Listener {
  (): boolean;
  listening: boolean;
}

type Change<T extends Tea> = ((tea: T) => T | Promise<T>) | T;

export interface Cup<T extends Tea> {
  (): T;
  (change: Change<T>): Promise<T>;
  on: (fn: Handler<T>) => Listener;
  clear: () => void;
}

export const createCup = <T extends Tea>(initialTea: T): Cup<T> => {
  let handlers = new Set<Handler<T>>();
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
    handlers.forEach(handler => {
      if (isCancelled.cancelled) {
        return;
      }
      handler(tea);
    });
  };

  function cup(): T;
  function cup(change: Change<T>): Promise<T>;
  function cup(change?: Change<T>) {
    if (arguments.length === 0) {
      return tea;
    }
    return Promise.resolve(
      typeof change === 'function' ? change(tea) : change,
    ).then(newTea => {
      setTea(newTea);
      return tea;
    });
  }

  cup.on = (fn: Handler<T>) => {
    handlers.add(fn);
    const listener = () => handlers.delete(fn);
    Object.defineProperty(listener, 'listening', {
      get: () => handlers.has(fn),
    });
    return listener as Listener;
  };

  cup.clear = () => handlers.clear();

  return cup;
};

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

type Handler<T extends Tea> = (tea: T, context: Context) => void;
export interface Listener {
  (): boolean;
  listening: boolean;
}

type Order<T extends Tea> = ((tea: T) => T | Promise<T>) | T;

export interface Cup<T extends Tea> {
  (): T;
  (order: Order<T>, context?: Context): Promise<T>;
  on: (fn: Handler<T>) => Listener;
  clear: () => void;
}
type Context = WeakSet<Cup<any>>;

export function createCup<T extends Tea>(
  firstTea: T,
  fixation: (tea: T) => T = t => t,
): Cup<T> {
  let handlers = new Set<Handler<T>>();
  let fixedTea = fixation(firstTea);

  let isPreviousCancelled = { cancelled: false };

  const setTea = (teaRefill: T, context: Context) => {
    const fixedNewTea = fixation(teaRefill);
    if (
      fixedTea === fixedNewTea ||
      (Number.isNaN(fixedTea as any) && Number.isNaN(fixedNewTea as any))
    ) {
      return;
    }
    isPreviousCancelled.cancelled = true;
    const isCancelled = { cancelled: false };
    isPreviousCancelled = isCancelled;
    fixedTea = fixedNewTea;
    handlers.forEach(handler => {
      if (isCancelled.cancelled) {
        return;
      }
      handler(fixedTea, context);
    });
  };

  function cup(): T;
  function cup(order: Order<T>, context?: Context): Promise<T>;
  function cup(order?: Order<T>, context: Context = new WeakSet()) {
    if (arguments.length === 0) {
      return fixedTea;
    }
    return Promise.resolve(
      typeof order === 'function' ? order(fixedTea) : order,
    ).then(teaRefill => {
      if (context.has(cup)) {
        return fixedTea;
      }
      context.add(cup);
      setTea(teaRefill, context);
      return fixedTea;
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
}

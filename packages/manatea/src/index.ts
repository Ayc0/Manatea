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
export interface Server {
  (): boolean;
  listening: boolean;
}

type Order<T extends Tea> = ((tea: T) => T | Promise<T>) | T;

export interface Cup<T extends Tea> {
  (): T;
  (order: Order<T>, context?: Context): Promise<T>;
  on: (fn: Handler<T>) => Server;
  clear: () => void;
}
type Context = WeakSet<Cup<any>>;

export function orderCup<T extends Tea>(
  firstTea: T,
  flavoring: (tea: T) => T = t => t,
): Cup<T> {
  let handlers = new Set<Handler<T>>();
  let flavoredTea = flavoring(firstTea);

  let isPreviousCancelled = { cancelled: false };

  const setTea = (teaRefill: T, context: Context) => {
    const flavoredTeaRefill = flavoring(teaRefill);
    if (
      flavoredTea === flavoredTeaRefill ||
      (Number.isNaN(flavoredTea as any) &&
        Number.isNaN(flavoredTeaRefill as any))
    ) {
      return;
    }
    isPreviousCancelled.cancelled = true;
    const isCancelled = { cancelled: false };
    isPreviousCancelled = isCancelled;
    flavoredTea = flavoredTeaRefill;
    handlers.forEach(handler => {
      if (isCancelled.cancelled) {
        return;
      }
      handler(flavoredTea, context);
    });
  };

  function cup(): T;
  function cup(order: Order<T>, context?: Context): Promise<T>;
  function cup(order?: Order<T>, context: Context = new WeakSet()) {
    if (arguments.length === 0) {
      return flavoredTea;
    }
    return Promise.resolve(
      typeof order === 'function' ? order(flavoredTea) : order,
    ).then(teaRefill => {
      if (context.has(cup)) {
        return flavoredTea;
      }
      context.add(cup);
      setTea(teaRefill, context);
      return flavoredTea;
    });
  }

  cup.on = (fn: Handler<T>) => {
    handlers.add(fn);
    const server = () => handlers.delete(fn);
    Object.defineProperty(server, 'listening', {
      get: () => handlers.has(fn),
    });
    return server as Server;
  };

  cup.clear = () => handlers.clear();

  return cup;
}

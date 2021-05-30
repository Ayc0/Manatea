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

export type Context = WeakSet<Cup<any>>;

export function orderCup<T extends Tea>(
  firstTea: T,
  flavoring: (tea: T) => T = t => t,
): Cup<T> {
  const handlers = new Set<Handler<T>>();
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

// Experimental plate

type Unstable_Plate<Ts extends Tea[]> = {
  on: (fn: Handler<Ts>) => Server;
  clear: () => void;
};

export function unstable_plate<T0 extends Tea>(
  cups: [Cup<T0>],
): Unstable_Plate<[T0]>;
export function unstable_plate<T0 extends Tea, T1 extends Tea>(
  cups: [Cup<T0>, Cup<T1>],
): Unstable_Plate<[T0, T1]>;
export function unstable_plate<T0 extends Tea, T1 extends Tea, T2 extends Tea>(
  cups: [Cup<T0>, Cup<T1>, Cup<T2>],
): Unstable_Plate<[T0, T1, T2]>;
export function unstable_plate<
  T0 extends Tea,
  T1 extends Tea,
  T2 extends Tea,
  T3 extends Tea
>(cups: [Cup<T0>, Cup<T1>, Cup<T2>, Cup<T3>]): Unstable_Plate<[T0, T1, T2, T3]>;
export function unstable_plate<
  T0 extends Tea,
  T1 extends Tea,
  T2 extends Tea,
  T3 extends Tea,
  T4 extends Tea
>(
  cups: [Cup<T0>, Cup<T1>, Cup<T2>, Cup<T3>, Cup<T4>],
): Unstable_Plate<[T0, T1, T2, T3, T4]>;
export function unstable_plate<
  T0 extends Tea,
  T1 extends Tea,
  T2 extends Tea,
  T3 extends Tea,
  T4 extends Tea,
  T5 extends Tea
>(
  cups: [Cup<T0>, Cup<T1>, Cup<T2>, Cup<T3>, Cup<T4>, Cup<T5>],
): Unstable_Plate<[T0, T1, T2, T3, T4, T5]>;
export function unstable_plate<
  T0 extends Tea,
  T1 extends Tea,
  T2 extends Tea,
  T3 extends Tea,
  T4 extends Tea,
  T5 extends Tea,
  T6 extends Tea
>(
  cups: [Cup<T0>, Cup<T1>, Cup<T2>, Cup<T3>, Cup<T4>, Cup<T5>, Cup<T6>],
): Unstable_Plate<[T0, T1, T2, T3, T4, T5, T6]>;
export function unstable_plate<
  T0 extends Tea,
  T1 extends Tea,
  T2 extends Tea,
  T3 extends Tea,
  T4 extends Tea,
  T5 extends Tea,
  T6 extends Tea,
  T7 extends Tea
>(
  cups: [
    Cup<T0>,
    Cup<T1>,
    Cup<T2>,
    Cup<T3>,
    Cup<T4>,
    Cup<T5>,
    Cup<T6>,
    Cup<T7>,
  ],
): Unstable_Plate<[T0, T1, T2, T3, T4, T5, T6, T7]>;
export function unstable_plate<
  T0 extends Tea,
  T1 extends Tea,
  T2 extends Tea,
  T3 extends Tea,
  T4 extends Tea,
  T5 extends Tea,
  T6 extends Tea,
  T7 extends Tea,
  T8 extends Tea
>(
  cups: [
    Cup<T0>,
    Cup<T1>,
    Cup<T2>,
    Cup<T3>,
    Cup<T4>,
    Cup<T5>,
    Cup<T6>,
    Cup<T7>,
    Cup<T8>,
  ],
): Unstable_Plate<[T0, T1, T2, T3, T4, T5, T6, T7, T8]>;
export function unstable_plate<
  T0 extends Tea,
  T1 extends Tea,
  T2 extends Tea,
  T3 extends Tea,
  T4 extends Tea,
  T5 extends Tea,
  T6 extends Tea,
  T7 extends Tea,
  T8 extends Tea,
  T9 extends Tea
>(
  cups: [
    Cup<T0>,
    Cup<T1>,
    Cup<T2>,
    Cup<T3>,
    Cup<T4>,
    Cup<T5>,
    Cup<T6>,
    Cup<T7>,
    Cup<T8>,
    Cup<T9>,
  ],
): Unstable_Plate<[T0, T1, T2, T3, T4, T5, T6, T7, T8, T9]>;

export function unstable_plate(cups: Cup<any>[]): Unstable_Plate<any[]> {
  let handlers = new Set<Handler<any[]>>();
  for (const cup of cups) {
    cup.on((_tea, context) => {
      const teas = cups.map(c => c());
      for (const handler of handlers) {
        handler(teas, context);
      }
    });
  }

  const plate: Unstable_Plate<any[]> = {
    on: (fn: Handler<any[]>) => {
      handlers.add(fn);
      const server = () => handlers.delete(fn);
      Object.defineProperty(server, 'listening', {
        get: () => handlers.has(fn),
      });
      return server as Server;
    },
    clear: () => handlers.clear(),
  };

  return plate;
}

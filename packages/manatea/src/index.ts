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

type Handler<UnflavoredTea extends Tea> = (
  tea: UnflavoredTea,
  context: Context,
) => void;
export interface Server {
  (): boolean;
  listening: boolean;
}

type Order<FlavoredTea extends Tea, UnflavoredTea extends Tea> =
  | ((tea: FlavoredTea) => UnflavoredTea | Promise<UnflavoredTea>)
  | UnflavoredTea;

export interface Cup<FlavoredTea extends Tea, UnflavoredTea extends Tea> {
  (): FlavoredTea;
  (
    order: Order<FlavoredTea, UnflavoredTea>,
    context?: Context,
  ): Promise<FlavoredTea>;
  on: (fn: Handler<FlavoredTea>) => Server;
  clear: () => void;
}

export type Context = WeakSet<Cup<any, any>>;

export function orderCup<
  FlavoredTea extends Tea,
  UnflavoredTea extends Tea = FlavoredTea
>(
  firstTea: UnflavoredTea,
  flavoring: (
    tea: UnflavoredTea,
    previousTea?: FlavoredTea,
  ) => FlavoredTea = t => t as any,
): Cup<FlavoredTea, UnflavoredTea> {
  let handlers = new Set<Handler<FlavoredTea>>();
  let flavoredTea = flavoring(firstTea);

  let isPreviousCancelled = { cancelled: false };

  const setTea = (unflavoredTea: UnflavoredTea, context: Context) => {
    const flavoredTeaRefill = flavoring(unflavoredTea, flavoredTea);
    // Object.is is like `===` but consider that NaN === NaN, and +0 !== -0
    if (Object.is(flavoredTea, flavoredTeaRefill)) {
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

  function cup(): FlavoredTea;
  function cup(
    order: Order<FlavoredTea, UnflavoredTea>,
    context?: Context,
  ): Promise<FlavoredTea>;
  function cup(
    order?: Order<FlavoredTea, UnflavoredTea>,
    context: Context = new WeakSet(),
  ) {
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

  cup.on = (fn: Handler<FlavoredTea>) => {
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

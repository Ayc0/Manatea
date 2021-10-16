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

type Handler<FlavoredTea extends Tea> = (
  flavoredTea: FlavoredTea,
  context: Context,
) => void;
export interface Server {
  (): boolean;
  listening: boolean;
}

type Order<FlavoredTea extends Tea, UnflavoredTea extends Tea> =
  | UnflavoredTea
  | ((flavoredTea: FlavoredTea) => UnflavoredTea | Promise<UnflavoredTea>);

export interface Cup<FlavoredTea extends Tea, UnflavoredTea extends Tea> {
  (): FlavoredTea;
  (
    order: Order<FlavoredTea, UnflavoredTea>,
    context?: Context,
  ): Promise<FlavoredTea>;
  on: (fn: Handler<FlavoredTea>) => Server;
}

export type Context = WeakSet<Cup<any, any>>;

export function orderCup<
  FlavoredTea extends Tea,
  UnflavoredTea extends Tea = FlavoredTea
>(
  firstTea: UnflavoredTea | ((sip: Sip) => UnflavoredTea),
  flavoring: (
    unflavoredTea: UnflavoredTea,
    previouslyFlavoredTea?: FlavoredTea,
  ) => FlavoredTea = t => t as any,
): Cup<FlavoredTea, UnflavoredTea> {
  const [sip, cups] = takeASip();
  let flavoredTea: FlavoredTea = flavoring(
    typeof firstTea === 'function' ? firstTea(sip) : firstTea,
  );

  const handlers = new Set<Handler<FlavoredTea>>();

  let isPreviousCancelled = { value: false };
  const setTea = (unflavoredTea: UnflavoredTea, context: Context) => {
    const flavoredTeaRefill = flavoring(unflavoredTea, flavoredTea);
    // Object.is is like `===` but consider that NaN === NaN, and +0 !== -0
    if (Object.is(flavoredTea, flavoredTeaRefill)) {
      return;
    }
    isPreviousCancelled.value = true;
    const isCancelled = { value: false };
    isPreviousCancelled = isCancelled;
    flavoredTea = flavoredTeaRefill;
    handlers.forEach(handler => {
      if (isCancelled.value) {
        return;
      }
      handler(flavoredTea, context);
    });
  };

  if (typeof firstTea === 'function') {
    cups.forEach(c => {
      c.on((_tea, context) => {
        setTea(firstTea(sip), context);
      });
    });
  }

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
      // safe to do `order!` as the case `arguments.length === 0` already covers the `order?` set in the signature
      typeof order === 'function' ? order(flavoredTea) : order!,
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

  return cup;
}

type Sip = <C extends Cup<any, any>>(
  cup: C,
) => C extends Cup<infer FlavoredTea, any> ? FlavoredTea : never;
function takeASip() {
  const cups = new Set<Cup<any, any>>();
  const sip: Sip = cup => {
    cups.add(cup);
    return cup();
  };
  return [sip, cups] as const;
}

import * as React from 'react';
import { Cup, Tea, Server, Context } from 'manatea';

export const useInfuser = <
  FlavoredTea extends Tea,
  UnflavoredTea extends Tea = FlavoredTea,
>(
  cup: Cup<FlavoredTea, UnflavoredTea>,
) => {
  const [flavoredTea, setFlavoredTea] = React.useState(() => cup());

  React.useEffect(() => {
    const server: Server = cup.on((newlyFlavoredTea: FlavoredTea) =>
      setFlavoredTea(newlyFlavoredTea),
    );
    setFlavoredTea(cup());
    return () => {
      if (server.listening) {
        server();
      }
    };
  }, [cup]);

  return [
    flavoredTea,
    (unflavoredTea: UnflavoredTea, context?: Context) =>
      cup(unflavoredTea, context),
  ] as const;
};

import * as React from 'react';
import { Cup, Tea, Server, Context } from 'manatea';

export const useInfuser = <
  FlavoredTea extends Tea,
  UnflavoredTea extends Tea = FlavoredTea
>(
  cup: Cup<FlavoredTea, UnflavoredTea>,
) => {
  const [tea, setTea] = React.useState(() => cup());

  React.useEffect(() => {
    const server: Server = cup.on((tea: FlavoredTea) => setTea(tea));
    setTea(cup());
    return () => {
      if (server.listening) {
        server();
      }
    };
  }, [cup]);

  return [
    tea,
    (tea: UnflavoredTea, context?: Context) => cup(tea, context),
  ] as const;
};

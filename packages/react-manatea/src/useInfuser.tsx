import * as React from 'react';
import { Cup, Tea, Server } from 'manatea';

export const useInfuser = <T extends Tea>(cup: Cup<T>) => {
  const [tea, setTea] = React.useState(() => cup());

  React.useEffect(() => {
    const server: Server = cup.on((tea: T) => setTea(tea));
    setTea(cup());
    return () => {
      if (server.listening) {
        server();
      }
    };
  }, [cup]);

  return [tea, (tea: T) => cup(tea)] as [T, (tea: T) => void];
};

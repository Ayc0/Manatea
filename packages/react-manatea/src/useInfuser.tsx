import * as React from 'react';
import { Cup, Tea, Listener } from 'manatea';

export const useInfuser = <T extends Tea>(cup: Cup<T>) => {
  const [tea, setTea] = React.useState(() => cup());

  React.useEffect(() => {
    const listener: Listener = cup.on((tea: T) => setTea(tea));
    setTea(cup());
    return () => {
      if (listener.listening) {
        listener();
      }
    };
  }, [cup]);

  return [tea, (tea: T) => cup(tea)] as [T, (tea: T) => void];
};

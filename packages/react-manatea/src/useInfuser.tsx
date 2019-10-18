import * as React from 'react';
import { Cup, Tea, Listener } from 'manatea';

import { getCup } from './getCup';

export const useInfuser = <T extends Tea>(cup: string | Cup<T>) => {
  const [tea, setTea] = React.useState(getCup(cup)());

  React.useEffect(() => {
    const listener: Listener = getCup(cup).on((tea: Tea) => setTea(tea));
    setTea(getCup(cup)());
    return () => {
      if (listener.listening) {
        listener();
      }
    };
  }, [cup]);

  return [tea, (tea: Tea) => getCup(cup)(tea)] as [T, (tea: T) => void];
};

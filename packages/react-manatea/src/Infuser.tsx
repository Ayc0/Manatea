import { ReactNode } from 'react';
import { Cup, Tea } from 'manatea';

import { getCup } from './getCup';
import { useInfuser } from './useInfuser';

interface InfuserProps<T extends Tea> {
  cup: string | Cup<T>;
  children: (tea: T) => ReactNode;
}

export const Infuser = <T extends Tea>({ cup, children }: InfuserProps<T>) => {
  const [tea] = useInfuser<T>(getCup(cup));
  return children(tea);
};

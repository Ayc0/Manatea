import { ReactNode } from 'react';
import { Cup, Tea } from 'manatea';

import { useInfuser } from './useInfuser';

interface InfuserProps<T extends Tea> {
  cup: Cup<T>;
  children: (tea: T) => ReactNode;
}

export const Infuser = <T extends Tea>({ cup, children }: InfuserProps<T>) => {
  const [tea] = useInfuser<T>(cup);
  return children(tea);
};

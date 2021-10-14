import { ReactNode } from 'react';
import { Cup, Tea } from 'manatea';

import { useInfuser } from './useInfuser';

interface InfuserProps<FlavoredTea extends Tea, UnflavoredTea extends Tea> {
  cup: Cup<FlavoredTea, UnflavoredTea>;
  children: (tea: FlavoredTea) => ReactNode;
}

export const Infuser = <
  FlavoredTea extends Tea,
  UnflavoredTea extends Tea = FlavoredTea
>({
  cup,
  children,
}: InfuserProps<FlavoredTea, UnflavoredTea>) => {
  const [tea] = useInfuser<FlavoredTea, UnflavoredTea>(cup);
  return children(tea);
};

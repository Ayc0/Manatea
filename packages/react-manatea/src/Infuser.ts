import { ReactNode } from 'react';
import { Cup, Tea } from 'manatea';

import { useInfuser } from './useInfuser';

interface InfuserProps<FlavoredTea extends Tea, UnflavoredTea extends Tea> {
  cup: Cup<FlavoredTea, UnflavoredTea>;
  children: (flavoredTea: FlavoredTea) => ReactNode;
}

export const Infuser = <
  FlavoredTea extends Tea,
  UnflavoredTea extends Tea = FlavoredTea
>({
  cup,
  children,
}: InfuserProps<FlavoredTea, UnflavoredTea>) => {
  const [flavoredTea] = useInfuser<FlavoredTea, UnflavoredTea>(cup);
  return children(flavoredTea);
};

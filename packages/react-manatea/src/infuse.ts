import * as React from 'react';
import { Cup, Tea } from 'manatea';

import { useInfuser } from './useInfuser';

export const infuse = <
  FlavoredTea extends Tea,
  UnflavoredTea extends Tea = FlavoredTea
>(
  cup: Cup<FlavoredTea, UnflavoredTea>,
) => (component: React.ComponentType<any>) => {
  const Consumer = (props: any) => {
    const [tea] = useInfuser<FlavoredTea, UnflavoredTea>(cup);

    return React.createElement(component, {
      ...props,
      tea,
    });
  };

  return Consumer;
};

import * as React from 'react';
import { Cup, Tea } from 'manatea';

import { getCup } from './getCup';
import { useInfuser } from './useInfuser';

export const infuse = <T extends Tea>(cup: Cup<T>) => (
  component: React.ComponentType<any>,
) => {
  const Consumer = (props: any) => {
    const [tea] = useInfuser<T>(getCup(cup));

    return React.createElement(component, {
      ...props,
      tea,
    });
  };
  return Consumer;
};

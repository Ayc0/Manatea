import * as React from 'react';
import { Cup, Tea } from 'manatea';

import { useInfuser } from './useInfuser';

export const infuse = <T extends Tea>(cup: Cup<T>) => (
  component: React.ComponentType<any>,
) => {
  const Consumer = (props: any) => {
    const [tea] = useInfuser<T>(cup);

    return React.createElement(component, {
      ...props,
      tea,
    });
  };

  return Consumer;
};

import * as React from 'react';
import { Cup } from 'manatea';

import getCup from './getCup';
import useInfuser from './useInfuser';

export default (cup: Cup) => (component: React.ComponentType<any>) => {
  const Consumer = (props: any) => {
    const [tea] = useInfuser(getCup(cup));

    return React.createElement(component, {
      ...props,
      tea,
    });
  };
  return Consumer;
};

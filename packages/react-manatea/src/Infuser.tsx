import { ReactNode } from 'react';
import { Cup, Tea } from 'manatea';

import getCup from './getCup';
import useInfuser from './useInfuser';

interface Props {
  cup: Cup;
  children: (tea: Tea) => ReactNode;
}

const Infuser = (props: Props) => {
  const [tea] = useInfuser(getCup(props.cup));
  return props.children(tea);
};

export default Infuser;

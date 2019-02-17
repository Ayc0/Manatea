import * as React from "react";
import { Cup, Tea, Listener } from "manatea";

import getCup from "./getCup";

type UseInfuse = (cup: string | Cup) => [Tea, (tea: Tea) => void];

const useInfuse: UseInfuse = cup => {
  const [tea, setTea] = React.useState(getCup(cup)());

  React.useEffect(
    () => {
      const listener: Listener = getCup(cup).on((tea: Tea) => setTea(tea));
      setTea(getCup(cup)());
      return listener;
    },
    [cup]
  );

  return [tea, (tea: Tea) => getCup(cup)(tea)];
};

export default useInfuse;

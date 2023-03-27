import * as React from 'react';
import { Cup, Tea, Waiter, Context } from 'manatea';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

export const useInfuser = <
  FlavoredTea extends Tea,
  UnflavoredTea extends Tea = FlavoredTea,
>(
  cup: Cup<FlavoredTea, UnflavoredTea>,
) => {
  const subscribe = React.useMemo(() => {
    return (notify: () => void) => {
      const waiter: Waiter = cup.on(notify);
      return () => waiter();
    };
  }, [cup]);

  const flavoredTea = useSyncExternalStore<FlavoredTea>(subscribe, () => cup());

  return [
    flavoredTea,
    (unflavoredTea: UnflavoredTea, context?: Context) =>
      cup(unflavoredTea, context),
  ] as const;
};

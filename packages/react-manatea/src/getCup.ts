import { store, Cup, Tea } from 'manatea';

export const getCup = <T extends Tea>(cup: string | Cup<T>) => {
  if (typeof cup === 'string') {
    if (cup in store) {
      return store[cup];
    }
    throw new Error(`"${cup}" isn't in your tea store"`);
  }
  return cup as Cup<T>;
};

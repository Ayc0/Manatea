import { store, Cup } from 'manatea';

type GetCup = (cup: string | Cup) => Cup;

const getCup: GetCup = cup => {
  if (typeof cup === 'string') {
    if (cup in store) {
      return store[cup];
    }
    throw new Error(`"${cup}" isn't in your tea store"`);
  }
  return cup;
};

export default getCup;

import { store, Cup } from "manatea";

export default (cup: string | Cup) => {
  if (typeof cup === "string") {
    if (cup in store) {
      return store[cup];
    }
    throw new Error(`"${cup}" isn't in your tea store"`);
  }
  return cup;
};

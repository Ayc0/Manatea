import createInstance, { Value } from "./instance";
import getStore from "./store";

const manatea = (initialValue: Value, name: string) => {
  const enumerable = name !== undefined;
  const instance = createInstance(name, initialValue, enumerable);
  return getStore(instance, name, enumerable);
};

export default manatea;

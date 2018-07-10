import createInstance, { Value } from "./instance";
import getStore from "./store";

const manatea = (initialValue: Value, name: string) => {
  const instance = createInstance(name, initialValue);
  return getStore(instance, name);
};

export default manatea;

import createInstance from "./instance";
import getStore from "./store";

const manatea = (initialValue, name) => {
  const { instance, key } = createInstance(name, initialValue);
  return getStore(instance, key, name !== undefined);
};

export default manatea;

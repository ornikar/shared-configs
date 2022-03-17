export const sayHello = (...names) => {
  console.log(`hello ${names.join(', ')}`);
};

export const testSpread = ({ name, ...rest } = {}) => {
  console.log({ name, ...rest });
};

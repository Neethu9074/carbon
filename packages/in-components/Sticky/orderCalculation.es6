export function after(configs) {
  for (let i = 0, length = configs.length; i < length; i++) {
    const config = configs[i];
    config.setOrder(i);
  }
}

export function reduceProps(propsList) {
  return propsList.reduce((result, props) => result.concat([props]), []);
}

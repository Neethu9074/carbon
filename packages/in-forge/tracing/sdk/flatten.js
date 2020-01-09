export const flatten = (obj, path = '') => {
  if (!(obj instanceof Object)) return { [path.replace(/\.$/g, '')]: obj };

  return Object.keys(obj).reduce((output, key) => {
    return obj instanceof Array
      ? { ...output, ...flatten(obj[key], path + '[' + key + '].') }
      : { ...output, ...flatten(obj[key], path + key + '.') };
  }, {});
};

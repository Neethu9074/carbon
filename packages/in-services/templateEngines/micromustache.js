import { renderFn, get } from 'micromustache';

const truncate = (str, num) => (str.length > num ? str.slice(0, num > 3 ? num - 3 : num) : str);
const takeFirst = (str, n, separator) =>
  str
    .split(separator)
    .slice(0, n)
    .join(separator);

// helpers available inside templates
const processors = {
  truncate,
  takeFirst
};

// resolves function calls inside the {{ template }}
export function resolve(varName, scope) {
  const matches = varName.match(/(\w+)\(([^)]*)\)/); // matches function call inside template
  if (matches) {
    const [, fnName, params] = matches;
    const paramNames = params.split(',').map(p => p.trim());
    const paramVals = paramNames.map(paramName => get(scope, paramName) || paramName);
    return processors[fnName](...paramVals);
  }
  // default resolver when no function gets applied
  return get(scope, varName);
}

export const compile = renderFn;

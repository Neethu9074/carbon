export function getLabel(span) {
  const flavor = span.getIn(['data', 'rpc', 'flavor']);
  const host = span.getIn(['data', 'rpc', 'host']);
  const method = span.getIn(['data', 'rpc', 'method']);
  var prefix = 'rpc://';

  if (flavor) {
    prefix = `${flavor}://`;
  }

  return `${prefix}${host}/${method}`;
}

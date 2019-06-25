export function getLabel(span) {
  const operationType = span.getIn(['data', 'graphql', 'operationType']);
  const operationName = span.getIn(['data', 'graphql', 'operationName']);

  return `${operationType} ${operationName}`;
}

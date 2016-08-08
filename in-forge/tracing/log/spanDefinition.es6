export function getLabel(span) {
  return span.getIn(['data', 'log', 'message']);
}

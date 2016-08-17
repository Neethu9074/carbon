export function getLabel(span) {
  const msg = span.getIn(['data', 'log', 'message'], '');
  if (msg.length > 100) {
    return `${msg.substring(0, 100)}…`;
  }
  return msg;
}

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function getLabel(span) {
  const msg = span.getIn(['data', 'log', 'message'], span.getIn(['data', 'log', 'parameters'], ''));
  if (msg.length > 100) {
    return `${msg.substring(0, 100)}…`;
  }
  return msg;
}

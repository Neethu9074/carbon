/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

export function getLabel(span) {
  const type = span.getIn(['data', 'sap', 'type']);
  const path = span.getIn(['data', 'sap', 'tcode']);
  const system = span.getIn(['data', 'sap', 'system']);
  var prefix = 'rfc://';

  if (type) {
    prefix = `${type}://`;
  }

  return `${prefix}${path}/${system}`;
}

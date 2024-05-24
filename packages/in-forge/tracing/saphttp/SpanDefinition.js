/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export function getLabel(span) {
  const type = span.getIn(['data', 'sap', 'type']);
  const path = span.getIn(['data', 'sap', 'tcode']);
  const system = span.getIn(['data', 'sap', 'system']);
  var prefix = 'http://';

  if (type) {
    prefix = `${type}://`;
  }

  return `${prefix}${path}/${system}`;
}

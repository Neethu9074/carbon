/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export function getLabel(span) {
  const serviceName = span.getIn(['data', 'webmethods', 'service']);

  return `${serviceName}`;
}

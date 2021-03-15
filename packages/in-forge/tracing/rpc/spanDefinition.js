/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function getLabel(span) {
  const flavor = span.getIn(['data', 'rpc', 'flavor']);
  const host = span.getIn(['data', 'rpc', 'host']);
  const call = span.getIn(['data', 'rpc', 'call']);
  var prefix = 'rpc://';

  if (flavor) {
    prefix = `${flavor}://`;
  }

  return `${prefix}${host}/${call}`;
}

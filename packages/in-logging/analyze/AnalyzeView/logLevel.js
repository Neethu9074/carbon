/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function getLogLevel(tags) {
  const match = tags.filter(({ name }) => name === 'log.level')[0];
  return match ? match.stringValue ?? match.booleanValue ?? match.doubleValue ?? match.longValue : undefined;
}

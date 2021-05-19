/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { LOG_LEVEL } from 'in-logging/queryBuilder';

export function getLogLevel(tags) {
  const match = tags.filter(({ name }) => name === LOG_LEVEL)[0];
  return match ? match.stringValue ?? match.booleanValue ?? match.doubleValue ?? match.longValue : undefined;
}

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { LOG_LEVEL } from 'in-logging/queryBuilder';
import { LogTag } from 'in-types';

export function getLogLevel(tags: LogTag[]): string | undefined {
  const match: LogTag | undefined = tags.filter(({ name }) => name === LOG_LEVEL)[0];
  if (!match) {
    return undefined;
  }
  if (match.longValue) {
    return String(match.longValue);
  }
  if (match.booleanValue) {
    return String(match.booleanValue);
  }
  return match.stringValue || undefined;
}

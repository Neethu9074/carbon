/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { LOG_LEVEL } from 'in-logging/queryBuilder';
import { LogLevel, LogTag } from '@instana/types';

export function getLogLevel(tags: LogTag[]): LogLevel | undefined {
  const match: LogTag | undefined = tags.filter(({ name }) => name === LOG_LEVEL)[0];
  if (!match) {
    return undefined;
  }
  if (match.longValue) {
    return String(match.longValue) as LogLevel;
  }
  if (match.booleanValue) {
    return String(match.booleanValue) as LogLevel;
  }
  return match.stringValue as LogLevel || undefined;
}

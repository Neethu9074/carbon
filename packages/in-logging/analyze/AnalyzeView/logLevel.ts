/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { LOG_LEVEL } from 'in-logging/queryBuilder';
import { TagFilter } from 'in-types';

export function getLogLevel(tags: TagFilter[]): string {
  const match: TagFilter | undefined = tags.filter(({ name }) => name === LOG_LEVEL)[0];
  return match ? match.stringValue ?? match.value ?? match.booleanValue ?? match.numberValue ?? undefined : undefined;
}

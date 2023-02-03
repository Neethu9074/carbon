/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { FetchStatus } from 'in-hooks/utils/types';

/**
 * Return a synchonized state of multiple FetchStatus
 */
export function all(...args: FetchStatus[]): FetchStatus {
  if (args.some(value => value === 'rejected')) {
    return 'rejected';
  }
  if (args.some(value => value === 'pending')) {
    return 'pending';
  }
  return 'resolved';
}

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Result } from '@instana/types';

import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';
import { Nullish } from 'in-types';

/**
 * Converts a Result to a fetched state triple.
 */
export function resultToFetchedStateResponse<T>(result: Result<T> | Nullish): FetchedState<T> {
  const res: Readonly<Result<T>> = result ?? (pendingResult as Result<T>);

  if (isLoading(res)) {
    return Object.freeze([undefined, 'pending', res.errors, res.progress] as const);
  }
  if (hasError(res)) {
    return Object.freeze([undefined, 'rejected', res.errors, res.progress] as const);
  }

  return Object.freeze([res.data!, 'resolved', res.errors, res.progress] as const);
}

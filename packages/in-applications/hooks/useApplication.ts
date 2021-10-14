/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';

import getApplication from 'in-applications/subscriptions/getApplication';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { Application, Error } from 'in-types';

type ResultStatus = 'pending' | 'resolved' | 'rejected';
interface UseApplicationResult {
  readonly application: Application;
  readonly status: ResultStatus;
  readonly errors: Error[];
}

export default function useApplication(applicationId: string): UseApplicationResult {
  const result = useObservable(() => getApplication({ id: applicationId }), [applicationId]) ?? pendingResult;

  let status: ResultStatus = 'resolved';
  if (isLoading(result)) {
    status = 'pending';
  }
  if (hasError(result)) {
    status = 'rejected';
  }

  return Object.freeze({
    application: result.data,
    status,
    errors: result.errors
  });
}

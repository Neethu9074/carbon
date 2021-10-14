/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';

import { hasError, isLoading } from 'in-services/util/result';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { pendingResult } from 'in-services/fixedObjects';
import { Error, Website } from 'in-types';

type ResultStatus = 'pending' | 'resolved' | 'rejected';
interface UseWebsiteResult {
  readonly website: Website;
  readonly status: ResultStatus;
  readonly errors: Error[];
}

export default function useWebsite(websiteId: string): UseWebsiteResult {
  const result = useObservable(() => getWebsite({ id: websiteId }), [websiteId]) ?? pendingResult;

  let status: ResultStatus = 'resolved';
  if (isLoading(result)) {
    status = 'pending';
  }
  if (hasError(result)) {
    status = 'rejected';
  }

  return Object.freeze({
    website: result.data,
    status,
    errors: result.errors
  });
}

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { FetchedState } from 'in-hooks/utils/types';
import { Website } from 'in-types';

export default function useWebsite(websiteId: string): FetchedState<Website> {
  const result = useObservable(() => getWebsite({ id: websiteId }), [websiteId]);
  return resultToFetchedStateResponse(result);
}

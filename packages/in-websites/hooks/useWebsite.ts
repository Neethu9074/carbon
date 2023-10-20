/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { FetchedState } from 'in-hooks/utils/types';
import { isBlank } from 'in-services/util/string';
import { error } from 'in-services/util/result';
import { Website } from 'in-types';

export default function useWebsite(websiteId: string): FetchedState<Website> {
  const result = useObservable(() => {
    if (isBlank(websiteId)) {
      return just(error<Website>([{ code: 'CLIENT', message: 'Website Id may not be blank' }]));
    }

    return getWebsite({ id: websiteId });
  }, [websiteId]);
  return resultToFetchedStateResponse(result);
}

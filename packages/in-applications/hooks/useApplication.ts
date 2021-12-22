/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import getApplication from 'in-applications/subscriptions/getApplication';
import { FetchedState } from 'in-hooks/utils/types';
import { Application } from 'in-types';

export default function useApplication(applicationId: string): FetchedState<Application> {
  const result = useObservable(() => getApplication({ id: applicationId }), [applicationId]);
  return resultToFetchedStateResponse(result);
}

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { FetchedState } from 'in-hooks/utils/types';
import { Result } from 'in-types';

export default function useFetchedStateObservable<I>(observable: () => Observable<Result<I>>): FetchedState<I> {
  const result = useObservable(observable, [observable]);
  return resultToFetchedStateResponse(result);
}

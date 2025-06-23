/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getSloTags } from 'in-service-levels/api/sloConfiguration';
import { FetchedState } from 'in-hooks/utils/types';

export default function useSloTags(): FetchedState<string[]> {
  const result = useObservable(() => getSloTags(), []);
  return resultToFetchedStateResponse(result);
}

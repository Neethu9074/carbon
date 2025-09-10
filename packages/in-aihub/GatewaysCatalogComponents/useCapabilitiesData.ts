/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { FetchedState } from 'in-hooks/utils/types';
import { getCapabilities } from 'in-aihub/api';

export default function useCapabilitiesData(): FetchedState<any> {
  const result = useObservable(getCapabilities(), []);

  return resultToFetchedStateResponse(result);
}

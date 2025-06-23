/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getSloConfiguration } from 'in-service-levels/api/sloConfiguration';
import { FetchedState } from 'in-hooks/utils/types';

export default function useSloConfiguration(sloId: string): FetchedState<ServiceLevelObjectiveConfiguration> {
  const result = useObservable(() => getSloConfiguration(sloId), [sloId]);

  return resultToFetchedStateResponse(result);
}

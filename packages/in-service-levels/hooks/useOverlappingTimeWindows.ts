/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import { TimeConfig } from '@instana/types';

import getSloQueryTimeWindowOverlap from 'in-service-levels/subscriptions/getSloQueryTimeWindowOverlap';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';
import { success } from 'in-services/util/result';

type SubscriptionPayload = Parameters<typeof getSloQueryTimeWindowOverlap>[0];
interface UseOverlappingTimeWindowsProps extends Partial<SubscriptionPayload> {}

export default function useOverlappingTimeWindows({
  sloConfigId,
  timeConfig
}: UseOverlappingTimeWindowsProps): FetchedState<TimeConfig[]> {
  const result =
    useObservable(() => {
      if (!sloConfigId || !timeConfig) return just(success([], Date.now()));

      return getSloQueryTimeWindowOverlap({
        sloConfigId,
        timeConfig
      });
    }, [sloConfigId, timeConfig]) ?? pendingResult;

  return resultToFetchedStateResponse(result);
}

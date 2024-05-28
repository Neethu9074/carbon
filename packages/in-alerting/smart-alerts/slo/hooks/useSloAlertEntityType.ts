/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Result, SloEntityType } from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getSloConfiguration } from 'in-service-levels/api/configuration';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';

export default function useSloAlertEntityType(sloIds: string[]): FetchedState<SloEntityType> {
  const result: Result<SloEntityType> =
    useObservable(() => {
      if (sloIds.length === 0) return just(undefined);

      return getSloConfiguration(sloIds[0]).map(result => ({
        ...result,
        data: result.data?.entity.type
      }));
    }, [generateStableHash(sloIds)]) ?? pendingResult;

  return resultToFetchedStateResponse(result);
}

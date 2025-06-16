/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useRef } from 'react';

import { Result, PaginatedResult, ServiceLevelObjectiveConfiguration } from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { SloData, sloConfigsToSloData } from 'in-service-levels/hooks/usePaginatedSloList';
import { getAllSloConfigurations } from 'in-service-levels/api/sloConfiguration';
import { FetchedState } from 'in-hooks/utils/types';
import { success } from 'in-services/util/result';

export default function useSelectedIds(sloIds: string[]): FetchedState<SloData[]> {
  const existingData = useRef<Result<PaginatedResult<ServiceLevelObjectiveConfiguration>>>();

  const data = useObservable(() => {
    if (sloIds.length === 0)
      return just(success({ items: [] }) as unknown as Result<PaginatedResult<ServiceLevelObjectiveConfiguration>>);

    return getAllSloConfigurations({
      ids: sloIds
    });
  }, [generateStableHash(sloIds)]);

  const isLoading = data?.progress.loading ?? true;
  if (!isLoading) existingData.current = data ?? undefined;

  const [result, ...restState] = resultToFetchedStateResponse(existingData.current);

  const sloData = sloConfigsToSloData(result?.items ?? []);
  return [sloData, ...restState] as FetchedState<SloData[]>;
}

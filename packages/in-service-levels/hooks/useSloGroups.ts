/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { InquiryResult, ServiceLevelObjectiveConfiguration } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { getAllSloGroups, GetAllSloConfigurationsArguments } from 'in-service-levels/api/sloConfiguration';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { FetchedState } from 'in-hooks/utils/types';

export default function useSloGroups({
  query,
  tags,
  sloStatus,
  entityType,
  blueprint
}: GetAllSloConfigurationsArguments): FetchedState<InquiryResult<ServiceLevelObjectiveConfiguration>> {
  const result = useObservable(
    () =>
      getAllSloGroups({
        query,
        tags,
        sloStatus,
        entityType,
        blueprint
      }),
    [query, tags, entityType, sloStatus, blueprint]
  );
  return resultToFetchedStateResponse(result);
}

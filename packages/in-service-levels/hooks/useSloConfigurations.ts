/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useEffect } from 'react';

import type { PaginatedResult, ServiceLevelObjectiveConfiguration } from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import { getAllSloConfigurations, refreshSloConfigs } from 'in-service-levels/api/sloConfiguration';
import type { GetAllSloConfigurationsArguments } from 'in-service-levels/api/sloConfiguration';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import type { FetchedState } from 'in-hooks/utils/types';

export default function useSloConfigurations({
  ids,
  page,
  pageSize,
  query,
  tags,
  sloStatus,
  entityType,
  entityIds,
  orderBy,
  orderDirection,
  blueprint
}: GetAllSloConfigurationsArguments): FetchedState<PaginatedResult<ServiceLevelObjectiveConfiguration>> {
  const [role] = useCurrentUserRole();

  useEffect(() => {
    refreshSloConfigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStableHash(role)]);

  const result = useObservable(
    () =>
      getAllSloConfigurations({
        ids,
        page,
        pageSize,
        query,
        tags,
        sloStatus,
        entityType,
        entityIds,
        orderBy,
        orderDirection,
        blueprint
      }),
    [generateStableHash(ids), page, pageSize, query, tags, entityType, orderBy, orderDirection, sloStatus, blueprint]
  );
  return resultToFetchedStateResponse(result);
}

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  TimeConfig,
  OrderDirection,
  Result,
  GroupPermissionEntity,
  GroupPermissionEntitiesQuery
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getAllSyntheticTestsForEntitySelection = createResultSubscriptionFactory<
  GroupPermissionEntitiesQuery,
  Result<GroupPermissionEntity[]>
>({
  eventId: 'getAllSyntheticTestsForEntitySelection'
});

export default getAllSyntheticTestsForEntitySelection;

interface QueryParams {
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
}

export function getAllSyntheticTestsForEntitySelectionWithDefaults({
  orderBy = 'name',
  orderDirection = 'ASC',
  timeConfig
}: QueryParams) {
  return getAllSyntheticTestsForEntitySelection({
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      timeConfig
    }
  });
}

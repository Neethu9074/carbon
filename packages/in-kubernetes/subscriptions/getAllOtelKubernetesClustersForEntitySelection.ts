/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  TimeConfig,
  OrderDirection,
  Result,
  GroupPermissionEntity,
  GroupPermissionEntitiesQuery
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getAllOtelKubernetesClustersForEntitySelection = createResultSubscriptionFactory<
  GroupPermissionEntitiesQuery,
  Result<GroupPermissionEntity[]>
>({
  eventId: 'getAllOtelKubernetesClustersForEntitySelection'
});

export default getAllOtelKubernetesClustersForEntitySelection;

interface QueryParams {
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
}

export function getAllOtelKubernetesClustersForEntitySelectionWithDefaults({
  orderBy = 'name',
  orderDirection = 'ASC',
  timeConfig
}: QueryParams) {
  return getAllOtelKubernetesClustersForEntitySelection({
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      timeConfig
    }
  });
}

/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import { TimeConfig, OrderDirection, Result } from '@instana/types';

import {
  GetGroupPermissionEntitiesQuery,
  GroupPermissionEntity
} from 'in-kubernetes/subscriptions/groupPermissionEntities';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getAllKubernetesClustersForEntitySelection = createResultSubscriptionFactory<
  GetGroupPermissionEntitiesQuery,
  Result<GroupPermissionEntity[]>
>({
  eventId: 'getAllKubernetesClustersForEntitySelection'
});

export default getAllKubernetesClustersForEntitySelection;

interface QueryParams {
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
}

export function getAllKubernetesClustersForEntitySelectionWithDefaults({
  orderBy = 'name',
  orderDirection = 'ASC',
  timeConfig
}: QueryParams) {
  return getAllKubernetesClustersForEntitySelection({
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      timeConfig
    }
  });
}

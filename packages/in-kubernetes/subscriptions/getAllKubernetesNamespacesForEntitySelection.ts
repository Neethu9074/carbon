/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TimeConfig, OrderDirection, Result } from '@instana/types';

import {
  GetGroupPermissionEntitiesQuery,
  GroupPermissionEntity
} from 'in-kubernetes/subscriptions/groupPermissionEntities';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getAllKubernetesNamespacesForEntitySelection = createResultSubscriptionFactory<
  GetGroupPermissionEntitiesQuery,
  Result<GroupPermissionEntity[]>
>({
  eventId: 'getAllKubernetesNamespacesForEntitySelection'
});

export default getAllKubernetesNamespacesForEntitySelection;

interface QueryParams {
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
}

export function getAllKubernetesNamespacesForEntitySelectionWithDefaults({
  orderBy = 'name',
  orderDirection = 'ASC',
  timeConfig
}: QueryParams) {
  return getAllKubernetesNamespacesForEntitySelection({
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      timeConfig
    }
  });
}

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  TimeConfig,
  OrderDirection,
  Result,
  GroupPermissionEntity,
  GroupPermissionEntitiesQuery
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getAllKubernetesNamespacesForEntitySelection = createResultSubscriptionFactory<
  GroupPermissionEntitiesQuery,
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

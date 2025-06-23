/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  TimeConfig,
  OrderDirection,
  PaginatedResult,
  GetKubernetesClustersQuery,
  KubernetesClusterListItem,
  Result
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getOtelKubernetesClusters = createResultSubscriptionFactory<
  GetKubernetesClustersQuery,
  Result<PaginatedResult<KubernetesClusterListItem>>
>({
  eventId: 'getNativeKubernetesClusters'
});

export default getOtelKubernetesClusters;

export interface QueryParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  query?: string;
  timeConfig: TimeConfig;
}

export function getOtelKubernetesClustersWithDefaults({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'name',
  orderDirection = 'ASC',
  timeConfig
}: QueryParams) {
  return getOtelKubernetesClusters({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      label: query,
      timeConfig
    }
  });
}

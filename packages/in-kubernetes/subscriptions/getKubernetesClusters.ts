/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  TimeConfig,
  OrderDirection,
  PaginatedResult,
  GetKubernetesClustersQuery,
  KubernetesCluster,
  Result
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getKubernetesClusters = createResultSubscriptionFactory<
  GetKubernetesClustersQuery,
  Result<PaginatedResult<KubernetesCluster>>
>({
  eventId: 'getKubernetesClusters'
});

export default getKubernetesClusters;

export interface QueryParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  query?: string;
  timeConfig: TimeConfig;
}

export function getKubernetesClustersWithDefaults({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'name',
  orderDirection = 'ASC',
  timeConfig
}: QueryParams) {
  return getKubernetesClusters({
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

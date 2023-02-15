/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  TimeConfig,
  OrderDirection,
  PaginatedResult,
  GetKubernetesNamespacesQuery,
  KubernetesNamespace,
  Result
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getKubernetesNamespaces = createResultSubscriptionFactory<
  GetKubernetesNamespacesQuery,
  Result<PaginatedResult<KubernetesNamespace>>
>({
  eventId: 'getKubernetesNamespaces'
});

export default getKubernetesNamespaces;

interface QueryParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  query?: string;
  timeConfig: TimeConfig;
  granularity?: number;
}

export function getKubernetesNamespacesWithDefaults({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'name',
  orderDirection = 'ASC',
  granularity = 0,
  timeConfig
}: QueryParams) {
  return getKubernetesNamespaces({
    pagination: {
      page,
      pageSize
    },
    granularity,
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

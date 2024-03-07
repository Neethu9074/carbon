/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  GetKubernetesPrometheusMetricsQuery,
  Result,
  PaginatedResult,
  KubernetesPrometheusMetricListItem,
  OrderDirection,
  TimeConfig
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export const getKubernetesPrometheusMetrics = createResultSubscriptionFactory<
  GetKubernetesPrometheusMetricsQuery,
  Result<PaginatedResult<KubernetesPrometheusMetricListItem>>
>({
  eventId: 'getKubernetesPrometheusMetrics'
});

interface QueryParams {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
  podId: string;
}

export function getKubernetesPrometheusMetricsWithDefaults({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig,
  podId
}: QueryParams) {
  return getKubernetesPrometheusMetrics({
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
      podId,
      timeConfig
    }
  });
}

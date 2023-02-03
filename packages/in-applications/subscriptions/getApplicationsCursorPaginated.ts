/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  ApplicationItem,
  GetApplicationsQuery,
  CursorPaginatedResult,
  Result,
  TimeConfig,
  OrderDirection,
  ContextScope,
  TagFilter
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { getSparkChartGranularity } from 'in-applications/metrics';

const getApplicationsCursorPaginated = createResultSubscriptionFactory<
  GetApplicationsQuery,
  Result<CursorPaginatedResult<ApplicationItem>>
>({
  eventId: 'getApplicationsCursorPaginated',
  trackSubscriptionStatistics: true
});
export default getApplicationsCursorPaginated;

interface GetApplicationsCursorPaginatedWithDefaultsProps {
  timeConfig: TimeConfig;
  query: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: OrderDirection;
  applicationId?: string;
  serviceId?: string;
  endpointId?: string;
  contextScope: ContextScope;
  tagFilters?: TagFilter[];
}

export function getApplicationsCursorPaginatedWithDefaults({
  timeConfig,
  query = '',
  orderBy = 'callsAgg',
  orderDirection = 'DESC',
  applicationId,
  serviceId,
  endpointId,
  contextScope,
  tagFilters
}: GetApplicationsCursorPaginatedWithDefaultsProps) {
  return getApplicationsCursorPaginated({
    pagination: {
      page: 1,
      pageSize: 20
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      services: {
        metric: 'services',
        aggregation: 'DISTINCT_COUNT'
      },
      callsAgg: {
        metric: 'calls',
        aggregation: 'SUM'
      },
      calls: {
        metric: 'calls',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      },
      latencyAgg: {
        metric: 'latency',
        aggregation: 'MEAN'
      },
      latency: {
        metric: 'latency',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      },
      errorsAgg: {
        metric: 'errors',
        aggregation: 'MEAN'
      },
      errors: {
        metric: 'errors',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      },
      openIssues: {
        metric: 'openIssues',
        aggregation: 'DISTINCT_COUNT'
      },
      maxSeverity: {
        metric: 'maxSeverity',
        aggregation: 'MAX'
      }
    },
    filter: {
      label: query,
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    contextScope: contextScope ? contextScope : 'NONE',
    tagFilters: tagFilters ? [...tagFilters] : undefined,
    supportedOrderByCriteria: false
  });
}

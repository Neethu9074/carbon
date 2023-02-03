/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  ContextScope,
  CursorPaginatedResult,
  GetServicesCursorPaginatedQuery,
  OrderDirection,
  Result,
  ServiceCursorPaginatedItem,
  TagFilter,
  TimeConfig,
  EndpointType
} from '@instana/types';
import { Observable } from '@instana/observables';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { getSparkChartGranularity } from 'in-applications/metrics';

const getServicesCursorPaginated = createResultSubscriptionFactory<
  GetServicesCursorPaginatedQuery,
  Result<CursorPaginatedResult<ServiceCursorPaginatedItem>>
>({
  eventId: 'getServicesCursorPaginated',
  trackSubscriptionStatistics: true
});

export default getServicesCursorPaginated;

interface GetServicesCursorPaginatedWithDefaultsProps {
  query: string;
  orderBy: string;
  orderDirection: OrderDirection;
  endpointTypes: EndpointType[];
  technologies: string[];
  timeConfig: TimeConfig;
  applicationId?: string;
  serviceId?: string;
  endpointId?: string;
  contextScope: ContextScope;
  tagFilters: TagFilter[];
}

export function getServicesCursorPaginatedWithDefaults({
  query = '',
  orderBy = 'callsAgg',
  orderDirection = 'DESC',
  endpointTypes = [],
  technologies = [],
  timeConfig,
  applicationId,
  serviceId,
  endpointId,
  contextScope,
  tagFilters
}: GetServicesCursorPaginatedWithDefaultsProps): Observable<Result<CursorPaginatedResult<ServiceCursorPaginatedItem>>> {
  return getServicesCursorPaginated({
    pagination: {
      retrievalSize: 20
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      applications: {
        metric: 'applications',
        aggregation: 'DISTINCT_COUNT'
      },
      endpoints: {
        metric: 'endpoints',
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
      timeConfig,
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      endpointTypes,
      technologies,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    contextScope: contextScope ? contextScope : 'NONE',
    tagFilters: tagFilters ? [...tagFilters] : undefined
  });
}

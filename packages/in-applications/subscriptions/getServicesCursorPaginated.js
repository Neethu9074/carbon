/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { getSparkChartGranularity } from 'in-applications/metrics';

const getServicesCursorPaginated = createResultSubscriptionFactory({
  eventId: 'getServicesCursorPaginated',
  trackSubscriptionStatistics: true
});

export default getServicesCursorPaginated;

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
}) {
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
      technologies
    },
    contextScope: contextScope ? contextScope : 'NONE',
    tagFilters: tagFilters ? [...tagFilters] : null
  });
}

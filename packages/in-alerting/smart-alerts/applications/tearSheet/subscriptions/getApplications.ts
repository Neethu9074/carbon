/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  TimeConfig,
  ContextScope,
  OrderDirection,
  TagFilter,
  PaginatedResult,
  ApplicationItem,
  GetApplicationsQuery,
  Result,
  TagFilterExpression
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { collationLanguage } from 'in-i18n';

const getApplications = createResultSubscriptionFactory<GetApplicationsQuery, Result<PaginatedResult<ApplicationItem>>>(
  {
    eventId: 'getApplications',
    trackSubscriptionStatistics: true
  }
);
export default getApplications;

interface GetApplicationsWithDefaultsProps {
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
  tagFilterExpression?: TagFilterExpression;
  granularity: number;
}

export function getApplicationsWithDefaults({
  timeConfig,
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'callsAgg',
  orderDirection = 'DESC',
  applicationId = '',
  serviceId = '',
  endpointId = '',
  contextScope,
  tagFilters = [],
  tagFilterExpression = undefined,
  granularity
}: GetApplicationsWithDefaultsProps) {
  return getApplications({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection,
      collation: collationLanguage
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
        granularity: granularity
      },
      latencyAgg: {
        metric: 'latency',
        aggregation: 'MEAN'
      },
      latency: {
        metric: 'latency',
        aggregation: 'MEAN',
        granularity: granularity
      },
      errorsAgg: {
        metric: 'errors',
        aggregation: 'MEAN'
      },
      errors: {
        metric: 'errors',
        aggregation: 'MEAN',
        granularity: granularity
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
    supportedOrderByCriteria: false,
    tagFilterExpression: tagFilterExpression
  });
}

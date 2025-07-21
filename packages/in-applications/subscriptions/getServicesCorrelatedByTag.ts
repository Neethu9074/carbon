/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  GetServicesCorrelatedByTagQuery,
  OrderDirection,
  PaginatedResult,
  QueryPrecision,
  Result,
  ServiceItem,
  TagFilterEntity,
  TimeConfig
} from '@instana/types';
import { Observable } from '@instana/observables';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getServicesCorrelatedByTag = createResultSubscriptionFactory<
  GetServicesCorrelatedByTagQuery,
  Result<PaginatedResult<ServiceItem>>
>({
  eventId: 'getServicesCorrelatedByTag',
  trackSubscriptionStatistics: true
});

export default getServicesCorrelatedByTag;

interface GetServicesCorrelatedByTagWithDefaultsProps {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
  serviceId: string;
  correlationTag: string;
  correlationTagEntity: TagFilterEntity;
  correlationTagSecondLevelKey?: string;
  queryPrecision?: QueryPrecision;
}

export function getServicesCorrelatedByTagWithDefaults({
  page = 1,
  pageSize = 20,
  orderBy = 'callsAgg',
  orderDirection = 'DESC',
  timeConfig,
  serviceId,
  correlationTag,
  correlationTagEntity,
  correlationTagSecondLevelKey,
  queryPrecision = 'FULL'
}: GetServicesCorrelatedByTagWithDefaultsProps): Observable<Result<PaginatedResult<ServiceItem>>> {
  return getServicesCorrelatedByTag({
    serviceId,
    correlationTag,
    correlationTagEntity,
    correlationTagSecondLevelKey,
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      callsAgg: {
        metric: 'calls',
        aggregation: 'SUM'
      }
    },
    filter: {
      timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    queryPrecision
  });
}

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  PaginatedResult,
  Result,
  BusinessDataQuery,
  BusinessActivity,
  OrderDirection,
  TagFilterExpression,
  TimeConfig
} from '@instana/types';
import { Observable } from '@instana/observables';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getBusinessActivityList = createResultSubscriptionFactory<
  BusinessDataQuery,
  Result<PaginatedResult<BusinessActivity>>
>({
  eventId: 'getBusinessActivities',
  trackSubscriptionStatistics: true
});

export default getBusinessActivityList;

interface GetBusinessActivityListDefaultProps {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
  tagFilterExpression: TagFilterExpression;
}
export function getBusinessActivityListWithDefaults({
  //The value of query is from the Search box, by default, it is ''.
  page = 1,
  pageSize = 20,
  orderBy = 'count',
  orderDirection = 'DESC',
  timeConfig,
  tagFilterExpression
}: GetBusinessActivityListDefaultProps): Observable<Result<PaginatedResult<BusinessActivity>>> {
  return getBusinessActivityList({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    dataType: 'ACTIVITY',
    metrics: {
      count: {
        aggregation: 'DISTINCT_COUNT',
        metric: 'activities_count'
      }
    },
    timeConfig,
    tagFilterExpression
  });
}

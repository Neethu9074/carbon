/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Observable } from '@instana/observables';

import {
  PaginatedResult,
  Result,
  GetBusinessActivitiesQuery,
  BusinessActivity,
  OrderDirection,
  TagFilterExpression,
  TimeConfig
} from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getBusinessActivityList = createResultSubscriptionFactory<
  GetBusinessActivitiesQuery,
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
  tagFilterExpression?: TagFilterExpression;
}
export function getBusinessActivityListWithDefaults({
  //The value of query is from the Search box, by default, it is ''.
  page = 1,
  pageSize = 20,
  orderBy = 'activitiesCount',
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
    metrics: {
      count: {
        aggregation: 'DISTINCT_COUNT',
        metric: 'activitiesCounts'
      }
    },
    filter: {
      timeConfig: timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    tagFilterExpression: tagFilterExpression ? tagFilterExpression : undefined
  });
}

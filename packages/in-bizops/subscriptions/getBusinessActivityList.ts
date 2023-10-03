/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Observable } from '@instana/observables';

import {
  PaginatedResult,
  Result,
  BusinessDataQuery,
  BusinessActivity,
  OrderDirection,
  TagFilterExpression,
  TimeConfig
} from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getBusinessActivityList = createResultSubscriptionFactory<
  BusinessDataQuery,
  Result<PaginatedResult<BusinessActivity>>
>({
  eventId: 'getBusinessActivitiesStandard',
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
  orderBy = 'activitiesCount',
  orderDirection = 'DESC',
  timeConfig,
  tagFilterExpression
}: GetBusinessActivityListDefaultProps): Observable<Result<PaginatedResult<BusinessActivity>>> {
  // @ts-ignore  TODO:  remove this ignore once the BusinessDataQuery type has been re-generated
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
        metric: 'activitiesCounts'
      }
    },
    timeConfig,
    tagFilterExpression
  });
}

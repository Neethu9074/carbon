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
  TimeConfig,
  Order,
  Pagination,
  AggregationType,
  Filter,
  TagFilterExpression
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

interface getBusinessActivityListDefaultProps {
  filter: Filter;
  metrics: {
    id: {
      metric: string;
      aggregation: AggregationType;
    };
  };
  order: Order;
  pagination: Pagination;
  tagFilterExpression?: TagFilterExpression;
  timeConfig?: TimeConfig;
}

export function getBusinessActivityListWithDefaults({
  filter,
  metrics,
  order,
  pagination,
  tagFilterExpression,
  timeConfig
}: getBusinessActivityListDefaultProps): Observable<Result<PaginatedResult<BusinessActivity>>> {
  return getBusinessActivityList({
    pagination: pagination,
    order: order,
    metrics: metrics,
    filter: filter,
    tagFilterExpression: tagFilterExpression ? tagFilterExpression : undefined,
    timeConfig: timeConfig ? timeConfig : undefined
  });
}

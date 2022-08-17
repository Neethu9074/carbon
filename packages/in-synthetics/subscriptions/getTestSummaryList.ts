/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Observable } from '@instana/observables';

import {
  GetTestSummaryListQuery,
  OrderDirection,
  PaginatedResult,
  Result,
  TestResultListItem,
  TagFilter,
  TimeConfig
} from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getTestSummaryList = createResultSubscriptionFactory<
  GetTestSummaryListQuery,
  Result<PaginatedResult<TestResultListItem>>
>({
  eventId: 'getTestSummaryList',
  trackSubscriptionStatistics: true
});

export default getTestSummaryList;

interface GetTestSummaryListWithDefaultsProps {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
  tagFilters?: TagFilter[];
}
export function getTestSummaryListWithDefaults({
  //The value of query is from the Search box, by default, it is ''.
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'test_name',
  orderDirection = 'ASC',
  timeConfig,
  tagFilters = []
}: GetTestSummaryListWithDefaultsProps): Observable<Result<PaginatedResult<TestResultListItem>>> {
  return getTestSummaryList({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    //Having the metrics block in the payload mainly for passing the granularity (unit is in seconds)
    //to the backend to get the data for the response time spark chart.
    metrics: {
      response_time: {
        metric: 'response_time',
        granularity: 60,
        aggregation: 'MEAN'
      }
    },
    filter: {
      label: query,
      timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    tagFilters: tagFilters ? [...tagFilters] : undefined
  });
}

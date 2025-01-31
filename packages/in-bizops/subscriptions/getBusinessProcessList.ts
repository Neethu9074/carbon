/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  BusinessDataQuery,
  OrderDirection,
  PaginatedResult,
  Result,
  BusinessProcess,
  TimeConfig,
  TagFilterExpression
} from '@instana/types';
import { Observable } from '@instana/observables';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { getChartGranularity } from 'in-stores/metric/metric';

const getBusinessProcessList = createResultSubscriptionFactory<
  BusinessDataQuery,
  Result<PaginatedResult<BusinessProcess>>
>({
  eventId: 'getBusinessProcesses',
  trackSubscriptionStatistics: true
});

export default getBusinessProcessList;

interface GetBusinessProcessListDefaultProps {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
  tagFilterExpression: TagFilterExpression;
}
export function getBusinessProcessListWithDefaults({
  //The value of query is from the Search box, by default, it is ''.
  page = 1,
  pageSize = 20,
  orderBy = 'process_name',
  orderDirection = 'ASC',
  timeConfig,
  tagFilterExpression
}: GetBusinessProcessListDefaultProps): Observable<Result<PaginatedResult<BusinessProcess>>> {
  return getBusinessProcessList({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    dataType: 'PROCESS',
    //Having the metrics block in the payload mainly for passing the granularity (unit is in seconds)
    //to the backend to get the data for the response time spark chart.
    metrics: {
      started_processes: {
        metric: 'started_processes',
        granularity: getChartGranularity(timeConfig),
        aggregation: 'DISTINCT_COUNT'
      }
    },
    timeConfig,
    tagFilterExpression
  });
}

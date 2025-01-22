/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  GetSubtracesQuery,
  GetSubtracesQueryFilter,
  SubtraceItem,
  Order,
  PaginatedResult,
  Pagination,
  Result
} from '@instana/types';
import { Observable } from '@instana/observables';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { SubtraceMetrics } from 'in-applications/types';

interface GetSubtracesWithDefaultsProps {
  filter: GetSubtracesQueryFilter;
  order: Order;
  pagination: Pagination;
}

export const getSubtraces: (parameter: GetSubtracesQuery) => Observable<Result<PaginatedResult<SubtraceItem>>> =
  createResultSubscriptionFactory<GetSubtracesQuery, Result<PaginatedResult<SubtraceItem>>>({
    eventId: 'getSubtraces'
  });

export const getSubtracesWithDefaults = ({
  filter,
  order = { by: 'subtraceName', direction: 'ASC' },
  pagination = { pageSize: 10, page: 1 }
}: GetSubtracesWithDefaultsProps): Observable<Result<PaginatedResult<SubtraceItem>>> => {
  return getSubtraces({
    filter,
    metrics: {
      subtraceCount: { metric: 'subtraces', aggregation: 'SUM' },
      calls: { metric: 'subtraceCalls', aggregation: 'MEAN' },
      errorRate: { metric: 'subtraceErrorRate', aggregation: 'MEAN' },
      duration: { metric: 'subtraceDuration', aggregation: 'MEAN' }
    } as SubtraceMetrics,
    order,
    pagination
  });
};

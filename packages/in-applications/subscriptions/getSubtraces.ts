/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Observable } from '@instana/observables';

import {
  GetSubtracesQuery,
  GetSubtracesQueryFilter,
  GetSubtracesResponseItem,
  Order,
  PaginatedResult,
  Pagination,
  Result
} from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { SubtraceMetrics } from 'in-applications/types';

interface GetSubtracesWithDefaultsProps {
  filter: GetSubtracesQueryFilter;
  order: Order;
  pagination: Pagination;
}

export const getSubtraces: (
  parameter: GetSubtracesQuery
) => Observable<Result<PaginatedResult<GetSubtracesResponseItem>>> = createResultSubscriptionFactory<
  GetSubtracesQuery,
  Result<PaginatedResult<GetSubtracesResponseItem>>
>({ eventId: 'getSubtraces' });

export const getSubtracesWithDefaults = ({
  filter,
  order = { by: 'subtraceName', direction: 'ASC' },
  pagination = { pageSize: 10, page: 1 }
}: GetSubtracesWithDefaultsProps): Observable<Result<PaginatedResult<GetSubtracesResponseItem>>> => {
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

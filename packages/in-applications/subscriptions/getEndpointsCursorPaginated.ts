/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  CursorPaginatedResult,
  EndpointCursorPaginatedItem,
  GetEndpointsCursorPaginatedQuery,
  Result
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetEndpointsCursorPaginatedQuery,
  Result<CursorPaginatedResult<EndpointCursorPaginatedItem>>
>({
  eventId: 'getEndpointsCursorPaginated',
  trackSubscriptionStatistics: true
});

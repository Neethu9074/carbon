/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { GetServicesByApplicationQuery, PaginatedResult, Result, ServiceItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export const getServicesByApplication = createResultSubscriptionFactory<
  GetServicesByApplicationQuery,
  Result<PaginatedResult<ServiceItem>>
>({
  eventId: 'getServicesByApplication',
  memoizeFor: 1000
});

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, GetTopServicesQuery, CursorPaginatedResult, TopServiceItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export interface GetTopServicesResult extends Result<CursorPaginatedResult<TopServiceItem>> {}

export default createResultSubscriptionFactory<GetTopServicesQuery, GetTopServicesResult>({
  eventId: 'getTopServices',
  trackSubscriptionStatistics: true
});

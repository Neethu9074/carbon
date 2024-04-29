/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { GetMobileAppSubdivisionsQuery, Result, PaginatedResult, MobileAppSubdivisionsItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetMobileAppSubdivisionsQuery,
  Result<PaginatedResult<MobileAppSubdivisionsItem>>
>({
  eventId: 'getMobileAppSubdivisions',
  trackSubscriptionStatistics: true
});

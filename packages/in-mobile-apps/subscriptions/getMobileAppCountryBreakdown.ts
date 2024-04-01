/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { GetMobileAppCountryBreakdownQuery, Result, PaginatedResult, MobileAppCountryBreakdown } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetMobileAppCountryBreakdownQuery,
  Result<PaginatedResult<MobileAppCountryBreakdown>>
>({
  eventId: 'getMobileAppCountryBreakdown',
  trackSubscriptionStatistics: true
});

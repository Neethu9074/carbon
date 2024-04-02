/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetWebsiteCountryBreakdownQuery, Result, PaginatedResult, WebsiteCountryBreakdown } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetWebsiteCountryBreakdownQuery,
  Result<PaginatedResult<WebsiteCountryBreakdown>>
>({
  eventId: 'getWebsiteCountryBreakdown',
  trackSubscriptionStatistics: true
});

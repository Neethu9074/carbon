/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetWebsiteSubdivisionsQuery, Result, PaginatedResult, WebsiteSubdivisionsItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetWebsiteSubdivisionsQuery,
  Result<PaginatedResult<WebsiteSubdivisionsItem>>
>({
  eventId: 'getWebsiteSubdivisions',
  trackSubscriptionStatistics: true
});

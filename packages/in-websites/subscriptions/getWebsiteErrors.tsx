/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetWebsiteErrorsQuery, PaginatedResult, Result, WebsiteErrorsItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetWebsiteErrorsQuery, Result<PaginatedResult<WebsiteErrorsItem>>>({
  eventId: 'getWebsiteErrors',
  trackSubscriptionStatistics: true
});

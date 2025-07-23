/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetWebsiteErrorQuery, Result, JavaScriptError } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetWebsiteErrorQuery, Result<JavaScriptError>>({
  eventId: 'getWebsiteError',
  trackSubscriptionStatistics: true
});

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { GetWebsiteErrorQuery, Result, JavaScriptError } from 'in-types';

export default createResultSubscriptionFactory<GetWebsiteErrorQuery, Result<JavaScriptError>>({
  eventId: 'getWebsiteError',
  trackSubscriptionStatistics: true
});

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetDeprecationsQuery, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetDeprecationsQuery, Result<string[]>>({
  eventId: 'getWebsiteDeprecations',
  trackSubscriptionStatistics: true
});

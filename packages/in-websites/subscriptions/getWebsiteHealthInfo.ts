/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetWebsiteHealthInfoQuery, Result, EntityHealthInfo } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetWebsiteHealthInfoQuery, Result<EntityHealthInfo>>({
  eventId: 'getWebsiteHealthInfo',
  trackSubscriptionStatistics: true
});

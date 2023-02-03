/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { EntityHealthInfo, GetApplicationEntityHealthInfoQuery, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetApplicationEntityHealthInfoQuery, Result<EntityHealthInfo>>({
  eventId: 'getApplicationEntityHealthInfo',
  trackSubscriptionStatistics: true
});

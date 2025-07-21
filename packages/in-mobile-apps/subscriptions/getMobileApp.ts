/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { GetMobileAppQuery, Result, MobileApp } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetMobileAppQuery, Result<MobileApp>>({
  eventId: 'getMobileApp',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetLatencyDistributionBase10Query, LatencyDistributionBase10, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetLatencyDistributionBase10Query, Result<LatencyDistributionBase10>>({
  eventId: 'getLatencyDistributionBase10',
  memoizeFor: 5000,
  trackSubscriptionStatistics: true
});

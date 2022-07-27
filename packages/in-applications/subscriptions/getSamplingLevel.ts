/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetSamplingLevelQuery, GetSamplingLevelResult, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetSamplingLevelQuery, Result<GetSamplingLevelResult>>({
  eventId: 'getSamplingLevel',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});

// move out of application

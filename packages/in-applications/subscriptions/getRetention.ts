/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { GetRetentionQuery, GetRetentionResult, Result } from 'in-types';

type GetRetentionResponse = Result<GetRetentionResult>;

export default createResultSubscriptionFactory<GetRetentionQuery, GetRetentionResponse>({
  eventId: 'getRetention',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});

// TODO move out of application

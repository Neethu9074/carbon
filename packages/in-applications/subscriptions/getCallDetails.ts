/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, GetCallDetailsQuery, CallDetails } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export interface GetCallDetailsResult extends Result<CallDetails> {}

export default createResultSubscriptionFactory<GetCallDetailsQuery, GetCallDetailsResult>({
  eventId: 'getCallDetails',
  trackSubscriptionStatistics: true
});

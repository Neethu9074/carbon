/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Result, GetApplicationAdaptiveBaselineModelQuery } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetApplicationAdaptiveBaselineModelQuery, Result<string>>({
  eventId: 'getApplicationAdaptiveBaselineModel',
  memoizeFor: 1000
});

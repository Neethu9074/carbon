/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, GetWebsiteAdaptiveBaselineModelQuery } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetWebsiteAdaptiveBaselineModelQuery, Result<string>>({
  eventId: 'getWebsiteAdaptiveBaselineModel',
  memoizeFor: 1000
});

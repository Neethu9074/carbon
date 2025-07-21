/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, GetMobileAppAdaptiveBaselineModelQuery } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetMobileAppAdaptiveBaselineModelQuery, Result<string>>({
  eventId: 'getMobileAppAdaptiveBaselineModel',
  memoizeFor: 1000
});

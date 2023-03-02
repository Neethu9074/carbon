/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, GetWebsiteAdaptiveBaselineModelQuery } from 'in-types';

export default createResultSubscriptionFactory<GetWebsiteAdaptiveBaselineModelQuery, Result<string>>({
  eventId: 'getWebsiteAdaptiveBaselineModel',
  memoizeFor: 1000
});

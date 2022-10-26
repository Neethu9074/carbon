/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, GetAdaptiveBaselineModelQuery } from 'in-types';

export default createResultSubscriptionFactory<GetAdaptiveBaselineModelQuery, Result<string>>({
  eventId: 'getAdaptiveBaselineModel',
  memoizeFor: 1000
});

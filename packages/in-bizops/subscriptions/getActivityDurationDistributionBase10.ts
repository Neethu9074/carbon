/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, GetActivityDurationDistributionBase10Query, LatencyDistributionBase10 } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetActivityDurationDistributionBase10Query,
  Result<LatencyDistributionBase10>
>({
  eventId: 'getActivityDurationDistributionBase10'
});

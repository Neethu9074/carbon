/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, GetMobileAppAdaptiveBaselinePredictionsQuery } from 'in-types';
import { MetricDataSeries } from 'in-applications/subscriptions/types';

export default createResultSubscriptionFactory<GetMobileAppAdaptiveBaselinePredictionsQuery, Result<MetricDataSeries>>({
  eventId: 'getMobileAppAdaptiveBaselinePredictions',
  memoizeFor: 0 // because subscribers rely on more than just the latest value
  // (and there is not an easy way to memoize all values of an observable)
});

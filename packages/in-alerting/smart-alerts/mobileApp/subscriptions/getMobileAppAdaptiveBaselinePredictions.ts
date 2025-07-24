/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, GetMobileAppAdaptiveBaselinePredictionsQuery } from '@instana/types';

import { AdaptiveBaselineFetchedPredictions } from 'in-alerting/smart-alerts/data/adaptiveBaselinePredictionInfo';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetMobileAppAdaptiveBaselinePredictionsQuery,
  Result<AdaptiveBaselineFetchedPredictions>
>({
  eventId: 'getMobileAppAdaptiveBaselinePredictions',
  memoizeFor: 0 // because subscribers rely on more than just the latest value
  // (and there is not an easy way to memoize all values of an observable)
});

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { AdaptiveBaselineFetchedPredictions } from 'in-alerting/smart-alerts/data/adaptiveBaselinePredictionInfo';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, GetApplicationAdaptiveBaselinePredictionsQuery } from 'in-types';

export default createResultSubscriptionFactory<
  GetApplicationAdaptiveBaselinePredictionsQuery,
  Result<AdaptiveBaselineFetchedPredictions>
>({
  eventId: 'getApplicationAdaptiveBaselinePredictions',
  memoizeFor: 0 // because subscribers rely on more than just the
  // latest value (and there is not an easy way to memoize all values of an observable)
  //
  // this did not work as usual: trackSubscriptionStatistics: true
});

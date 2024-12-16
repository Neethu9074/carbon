/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ThresholdSuggestionResponse } from '@instana/types/typeDefinitions';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, GetInfraMetricsThresholdSuggestionQuery } from 'in-types';

export default createResultSubscriptionFactory<
  GetInfraMetricsThresholdSuggestionQuery,
  Result<ThresholdSuggestionResponse>
>({
  eventId: 'getInfraMetricsThresholdSuggestion',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});

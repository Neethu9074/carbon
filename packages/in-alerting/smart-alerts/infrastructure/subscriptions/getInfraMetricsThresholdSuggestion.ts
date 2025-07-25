/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  Result,
  GetInfraMetricsThresholdSuggestionQuery,
  AdaptiveBaselineSuggestionResponse,
  StaticThresholdSuggestionResponse,
  Seasonality
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

type ThresholdSuggestionResponse = StaticThresholdSuggestionResponse | AdaptiveBaselineSuggestionResponse;

type GetInfraMetricsThresholdSuggestionQueryWithSmoothingOverrides = GetInfraMetricsThresholdSuggestionQuery & {
  seasonality?: Seasonality;
  adaptability?: number;
};

export default createResultSubscriptionFactory<
  GetInfraMetricsThresholdSuggestionQueryWithSmoothingOverrides,
  Result<ThresholdSuggestionResponse>
>({
  eventId: 'getInfraMetricsThresholdSuggestion',
  memoizeFor: 0
});

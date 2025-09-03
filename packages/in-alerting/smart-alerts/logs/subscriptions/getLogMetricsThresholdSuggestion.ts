/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  Result,
  AdaptiveBaselineSuggestionResponse,
  StaticThresholdSuggestionResponse,
  GetLogMetricsThresholdSuggestionQuery,
  Seasonality
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

type ThresholdSuggestionResponse = StaticThresholdSuggestionResponse | AdaptiveBaselineSuggestionResponse;

type GetLogMetricsThresholdSuggestionQueryWithSmoothingOverrides = GetLogMetricsThresholdSuggestionQuery & {
  seasonality?: Seasonality;
  adaptability?: number;
};

export default createResultSubscriptionFactory<
  GetLogMetricsThresholdSuggestionQueryWithSmoothingOverrides,
  Result<ThresholdSuggestionResponse>
>({
  eventId: 'getLogMetricsThresholdSuggestion',
  memoizeFor: 0
});

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  Result,
  GetApplicationMetricsThresholdSuggestionQuery,
  AdaptiveBaselineSuggestionResponse,
  HistoricBaselineSuggestionResponse,
  StaticThresholdSuggestionResponse
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

type ThresholdSuggestionResponse =
  | StaticThresholdSuggestionResponse
  | HistoricBaselineSuggestionResponse
  | AdaptiveBaselineSuggestionResponse;

export default createResultSubscriptionFactory<
  GetApplicationMetricsThresholdSuggestionQuery,
  Result<ThresholdSuggestionResponse>
>({
  eventId: 'getApplicationMetricsThresholdSuggestion',
  trackSubscriptionStatistics: true
});

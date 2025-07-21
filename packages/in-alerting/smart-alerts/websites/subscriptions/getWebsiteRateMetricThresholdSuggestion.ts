/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetWebsiteRateMetricThresholdSuggestionQuery, Result, ThresholdSuggestionResponse } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetWebsiteRateMetricThresholdSuggestionQuery,
  Result<ThresholdSuggestionResponse>
>({
  eventId: 'getWebsiteRateMetricThresholdSuggestion',
  trackSubscriptionStatistics: true
});

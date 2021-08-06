/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { GetWebsiteRateMetricThresholdSuggestionQuery, Result, ThresholdSuggestionResponse } from 'in-types';

export default createResultSubscriptionFactory<
  GetWebsiteRateMetricThresholdSuggestionQuery,
  Result<ThresholdSuggestionResponse>
>({
  eventId: 'getWebsiteRateMetricThresholdSuggestion',
  trackSubscriptionStatistics: true
});

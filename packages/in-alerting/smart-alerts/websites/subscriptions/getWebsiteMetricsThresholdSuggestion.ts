/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { GetWebsiteMetricsThresholdSuggestionQuery, Result, ThresholdSuggestionResponse } from 'in-types';

export default createResultSubscriptionFactory<
  GetWebsiteMetricsThresholdSuggestionQuery,
  Result<ThresholdSuggestionResponse>
>({
  eventId: 'getWebsiteMetricsThresholdSuggestion',
  trackSubscriptionStatistics: true
});

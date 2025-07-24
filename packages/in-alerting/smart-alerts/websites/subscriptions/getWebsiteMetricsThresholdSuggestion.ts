/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetWebsiteMetricsThresholdSuggestionQuery, Result, ThresholdSuggestionResponse } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetWebsiteMetricsThresholdSuggestionQuery,
  Result<ThresholdSuggestionResponse>
>({
  eventId: 'getWebsiteMetricsThresholdSuggestion',
  trackSubscriptionStatistics: true
});

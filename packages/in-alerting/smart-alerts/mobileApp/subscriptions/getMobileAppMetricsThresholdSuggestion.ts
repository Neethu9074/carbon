/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetMobileAppMetricsThresholdSuggestionQuery, Result, ThresholdSuggestionResponse } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetMobileAppMetricsThresholdSuggestionQuery,
  Result<ThresholdSuggestionResponse>
>({
  eventId: 'getMobileAppMetricsThresholdSuggestion',
  trackSubscriptionStatistics: true
});

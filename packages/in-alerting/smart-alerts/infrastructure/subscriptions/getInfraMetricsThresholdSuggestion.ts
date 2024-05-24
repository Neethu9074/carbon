/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, GetInfraMetricsThresholdSuggestionQuery } from 'in-types';
import { MetricDataSeries } from 'in-applications/subscriptions/types';

export default createResultSubscriptionFactory<GetInfraMetricsThresholdSuggestionQuery, Result<MetricDataSeries>>({
  eventId: 'getInfraMetricsThresholdSuggestion',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});

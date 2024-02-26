/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { GetMetricsMatchingRegexQuery, MetricsList, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetMetricsMatchingRegexQuery, Result<MetricsList>>({
  eventId: 'infrastructure.getMetricsMatchingRegex'
});

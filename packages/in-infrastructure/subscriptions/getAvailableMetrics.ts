/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { AvailableMetrics, GetAvailableMetricsQuery, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetAvailableMetricsQuery, Result<AvailableMetrics>>({
  eventId: 'infrastructure.getAvailableMetrics'
});

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { GetWebsiteRateMetricQuery, Result } from 'in-types';

interface ResultMap {
  [metricKey: string]: number[][];
}

export default createResultSubscriptionFactory<GetWebsiteRateMetricQuery, Result<ResultMap>>({
  eventId: 'getWebsiteRateMetric',
  trackSubscriptionStatistics: true
});

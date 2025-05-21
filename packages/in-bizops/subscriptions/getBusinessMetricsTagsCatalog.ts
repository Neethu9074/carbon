/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Result, TagCatalog, TimeConfig } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface GetBizOpsMetricTagCatalogQuery {
  metricName?: string;
  timeConfig: TimeConfig;
}

export default createResultSubscriptionFactory<GetBizOpsMetricTagCatalogQuery, Result<TagCatalog>>({
  eventId: 'getBusinessMetricsTagsCatalog',
  trackSubscriptionStatistics: true
});

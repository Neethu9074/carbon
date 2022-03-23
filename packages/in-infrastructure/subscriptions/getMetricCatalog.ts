/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, GetInfraMetricsCatalogQuery, MetricCatalog } from 'in-types';

export default createResultSubscriptionFactory<GetInfraMetricsCatalogQuery, Result<MetricCatalog>>({
  eventId: 'infrastructure.getMetricCatalog'
});

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { GetBusinessMetricsDefinitionsQuery, Result, BusinessMetricsDefinition, PaginatedResult } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetBusinessMetricsDefinitionsQuery,
  Result<PaginatedResult<BusinessMetricsDefinition>>
>({
  eventId: 'getBusinessMetricsDefinitions',
  trackSubscriptionStatistics: true
});

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface GetWebsiteMetricsRequest {}
interface GetWebsiteMetricsResponse extends Result<Map<String, Number[][]>> {}

export default createResultSubscriptionFactory<GetWebsiteMetricsRequest, GetWebsiteMetricsResponse>({
  eventId: 'getWebsiteMetrics',
  trackSubscriptionStatistics: true
});

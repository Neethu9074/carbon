/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { AlertClusterResponse, GetWebsiteAlertClustersQuery, Result } from 'in-types';

export default createResultSubscriptionFactory<GetWebsiteAlertClustersQuery, Result<AlertClusterResponse[]>>({
  eventId: 'getWebsiteAlertClusters',
  trackSubscriptionStatistics: true
});

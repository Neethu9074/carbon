/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { AlertClusterResponse, GetWebsiteAlertClustersQuery, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetWebsiteAlertClustersQuery, Result<AlertClusterResponse[]>>({
  eventId: 'getWebsiteAlertClusters',
  trackSubscriptionStatistics: true
});

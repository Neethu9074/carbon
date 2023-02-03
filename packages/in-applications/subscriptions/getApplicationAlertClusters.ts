/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { AlertClusterResponse, GetApplicationAlertClustersQuery, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetApplicationAlertClustersQuery, Result<AlertClusterResponse[]>>({
  eventId: 'getApplicationAlertClusters',
  trackSubscriptionStatistics: true
});

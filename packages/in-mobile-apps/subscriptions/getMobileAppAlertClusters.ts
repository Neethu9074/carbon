/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { AlertClusterResponse, Result, GetMobileAppAlertClustersQuery } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetMobileAppAlertClustersQuery, Result<AlertClusterResponse[]>>({
  eventId: 'getMobileAppAlertClusters',
  trackSubscriptionStatistics: true
});

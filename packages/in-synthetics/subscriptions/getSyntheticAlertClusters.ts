/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { AlertClusterResponse, GetSyntheticAlertClustersQuery, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetSyntheticAlertClustersQuery, Result<AlertClusterResponse[]>>({
  eventId: 'getSyntheticAlertClusters',
  trackSubscriptionStatistics: true
});

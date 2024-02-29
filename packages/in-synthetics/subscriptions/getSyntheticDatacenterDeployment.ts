/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { GetDatacenterDeploymentQuery, Result } from 'in-types';

export default createResultSubscriptionFactory<GetDatacenterDeploymentQuery, Result<Map<string, string>>>({
  eventId: 'getSyntheticDatacenterDeployment',
  trackSubscriptionStatistics: false
});

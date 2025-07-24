/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { GetDatacenterDeploymentQuery, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetDatacenterDeploymentQuery, Result<Map<string, string>>>({
  eventId: 'getSyntheticDatacenterDeployment'
});

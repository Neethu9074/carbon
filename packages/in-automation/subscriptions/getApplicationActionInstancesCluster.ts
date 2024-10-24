/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ActionInstance, PaginatedResult, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getApplicationActionInstancesForCluster = createResultSubscriptionFactory<
  any,
  Result<PaginatedResult<ActionInstance>>
>({
  eventId: 'getActionInstancesByTargetClusterByStartDate',
  disposeSubscriptionOnDocumentHidden: false
});

export default getApplicationActionInstancesForCluster;

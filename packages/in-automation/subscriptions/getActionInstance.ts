/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { GetActionInstanceQuery, ActionInstance, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getActionInstance = createResultSubscriptionFactory<GetActionInstanceQuery, Result<ActionInstance>>({
  eventId: 'getActionInstanceDetails',
  trackSubscriptionStatistics: true,
  memoizeFor: 0
});

export default getActionInstance;

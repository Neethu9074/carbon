/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { GetActionInstanceQuery, ActionInstance, Result } from 'in-types';

const getActionInstance = createResultSubscriptionFactory<GetActionInstanceQuery, Result<ActionInstance>>({
  eventId: 'getActionInstanceDetails',
  trackSubscriptionStatistics: true,
  memoizeFor: 0
});

export default getActionInstance;

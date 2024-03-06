/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { AgentRequest } from '@instana/types';

import createSubscription from 'in-subscription/subscription';

export default createSubscription<AgentRequest, ActionInstance>({
  eventId: 'submitTurbonomicAction',
  memoizeFor: 100
});

export type ActionInstance = {
  actionInstanceId: string;
  errorMessage: string;
};

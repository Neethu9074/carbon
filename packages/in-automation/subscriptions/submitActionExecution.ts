/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { AgentRequest } from '@instana/types';

import createSubscription from 'in-subscription/subscription';

export default createSubscription<AgentRequest, AgentResponse>({
  eventId: 'submitAction',
  memoizeFor: 100
});

export type AgentResponse = {
  data: { actionInstanceId: string };
  error: string;
};

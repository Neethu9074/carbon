/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import createSubscription from 'in-subscription/subscription';

export default createSubscription<any, AgentResponse>({
  eventId: 'subscribe-agent-response',
  memoizeFor: 100
});

export type AgentResponse = {
  data: any;
  error: string;
};

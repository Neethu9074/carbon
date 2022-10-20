/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import createSubscription from 'in-subscription/subscription';
import { Result, AgentSnapshot, TimeConfig } from 'in-types';

interface IN {
  timeConfig: TimeConfig;
  query: string;
}

interface Data {
  offline: AgentSnapshot[];
  online: AgentSnapshot[];
}

export type OUT = Result<Data>;

export default createSubscription<IN, OUT>({
  eventId: 'getAgentSnapshotsInTimeframe'
});

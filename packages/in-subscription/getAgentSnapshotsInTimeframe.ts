/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
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

export default createResultSubscriptionFactory<IN, OUT>({
  eventId: 'getAgentSnapshotsInTimeframe'
});

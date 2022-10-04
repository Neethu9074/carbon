/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
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

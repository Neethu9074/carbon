/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Result, AgentSnapshot, TimeConfig } from 'in-types';

import createSubscription from 'in-subscription/subscription';

interface IN {
  timeConfig: TimeConfig;
  query: string;
}

interface Data {
  offline: AgentSnapshot[];
  online: AgentSnapshot[];
}

type OUT = Result<Data>;

export default createSubscription<IN, OUT>({
  eventId: 'getAgentSnapshotsInTimeframe'
});

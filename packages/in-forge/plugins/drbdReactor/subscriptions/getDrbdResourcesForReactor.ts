/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ContextQuery, Result, TimeConfig } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface getDrbdResourcesForReactorQuery extends ContextQuery {
  readonly snapshotId: string;
  readonly timeConfig: TimeConfig;
}

export default createResultSubscriptionFactory<getDrbdResourcesForReactorQuery, Result<Array<string>>>({
  eventId: 'getDrbdResourcesForReactor'
});

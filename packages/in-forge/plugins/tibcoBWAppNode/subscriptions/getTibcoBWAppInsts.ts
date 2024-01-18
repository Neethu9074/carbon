/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ContextQuery, Result, TimeConfig } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface GetTibcoBWAppInsts extends ContextQuery {
  readonly snapshotId: string;
  readonly timeConfig: TimeConfig;
}

export default createResultSubscriptionFactory<GetTibcoBWAppInsts, Result<Array<string>>>({
  eventId: 'getTibcoBWAppInsts'
});

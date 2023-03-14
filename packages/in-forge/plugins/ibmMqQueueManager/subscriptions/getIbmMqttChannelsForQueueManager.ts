/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { ContextQuery, Result, TimeConfig } from '@instana/types';

interface GetIbmMqttChannelsForQueueManagerQuery extends ContextQuery {
  readonly snapshotId: string;
  readonly timeConfig: TimeConfig;
}

export default createResultSubscriptionFactory<GetIbmMqttChannelsForQueueManagerQuery, Result<Array<string>>>({
  eventId: 'getIbmMqttChannelsForQueueManager'
});

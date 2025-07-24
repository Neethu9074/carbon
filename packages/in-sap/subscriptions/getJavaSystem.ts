/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, AbapSystemItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface GetSapJavaSystemRequest {}

interface GetSapJavaSystemResponse extends Result<AbapSystemItem> {}

export default createResultSubscriptionFactory<GetSapJavaSystemRequest, GetSapJavaSystemResponse>({
  eventId: 'getJavaSystem'
});

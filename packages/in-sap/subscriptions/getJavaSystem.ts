/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, AbapSystemItem } from 'in-types';

interface GetSapJavaSystemRequest {}

interface GetSapJavaSystemResponse extends Result<AbapSystemItem> {}

export default createResultSubscriptionFactory<GetSapJavaSystemRequest, GetSapJavaSystemResponse>({
  eventId: 'getJavaSystem'
});

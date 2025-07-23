/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, SapJavaInstanceItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface GetSapJavaInstanceRequest {}

interface GetSapJavaInstanceResponse extends Result<SapJavaInstanceItem> {}
export default createResultSubscriptionFactory<GetSapJavaInstanceRequest, GetSapJavaInstanceResponse>({
  eventId: 'getJavaInstance'
});

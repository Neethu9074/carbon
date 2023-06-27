/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, SapJavaInstanceItem } from 'in-types';

interface GetSapJavaInstanceRequest {}

interface GetSapJavaInstanceResponse extends Result<SapJavaInstanceItem> {}
export default createResultSubscriptionFactory<GetSapJavaInstanceRequest, GetSapJavaInstanceResponse>({
  eventId: 'getJavaInstance'
});

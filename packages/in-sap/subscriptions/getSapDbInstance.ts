/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, SapJavaInstanceItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface GetDbInstanceRequest {}

interface GetDbInstanceResponse extends Result<SapJavaInstanceItem> {}

export default createResultSubscriptionFactory<GetDbInstanceRequest, GetDbInstanceResponse>({
  eventId: 'getSapDbInstance'
});

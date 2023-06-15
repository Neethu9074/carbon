/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, SapDbInstanceItem } from 'in-types';

interface GetDbInstanceRequest {}

interface GetDbInstanceResponse extends Result<SapDbInstanceItem> {}

export default createResultSubscriptionFactory<GetDbInstanceRequest, GetDbInstanceResponse>({
  eventId: 'getSapDbInstance'
});

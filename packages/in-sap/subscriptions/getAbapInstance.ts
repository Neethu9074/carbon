/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, AbapInstanceItem } from 'in-types';

interface GetSapAbapInstanceRequest {}

interface GetSapAbapInstanceResponse extends Result<AbapInstanceItem> {}

export default createResultSubscriptionFactory<GetSapAbapInstanceRequest, GetSapAbapInstanceResponse>({
  eventId: 'getAbapInstance'
});

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, AbapSystemItem } from 'in-types';

interface GetSapHanaSystemRequest {}

interface GetSapHanaSystemResponse extends Result<AbapSystemItem> {}

export default createResultSubscriptionFactory<GetSapHanaSystemRequest, GetSapHanaSystemResponse>({
  eventId: 'getSapHanaSystem'
});

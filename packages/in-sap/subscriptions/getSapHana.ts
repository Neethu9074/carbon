/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, SapDbItem } from 'in-types';

interface GetSapHanaRequest {}

interface GetSapHanaResponse extends Result<SapDbItem> {}

export default createResultSubscriptionFactory<GetSapHanaRequest, GetSapHanaResponse>({
  eventId: 'getSapHana'
});

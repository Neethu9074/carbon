/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, SapHanaItem } from 'in-types';

interface GetSapHanaRequest {}

interface GetSapHanaResponse extends Result<SapHanaItem> {}

export default createResultSubscriptionFactory<GetSapHanaRequest, GetSapHanaResponse>({
  eventId: 'getSapHana'
});

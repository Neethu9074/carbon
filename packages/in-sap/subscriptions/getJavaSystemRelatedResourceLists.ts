/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, AbapSystemListItem } from 'in-types';

interface GetSapJavaSystemRelatedResourceRequest {}

interface GetSapJavaSystemRelatedResourceResponse extends Result<AbapSystemListItem> {}

export default createResultSubscriptionFactory<
  GetSapJavaSystemRelatedResourceRequest,
  GetSapJavaSystemRelatedResourceResponse
>({
  eventId: 'getJavaSystemRelatedResourceLists'
});

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, AbapSystemListItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface GetSapJavaSystemRelatedResourceRequest {}

interface GetSapJavaSystemRelatedResourceResponse extends Result<AbapSystemListItem> {}

export default createResultSubscriptionFactory<
  GetSapJavaSystemRelatedResourceRequest,
  GetSapJavaSystemRelatedResourceResponse
>({
  eventId: 'getJavaSystemRelatedResourceLists'
});

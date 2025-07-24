/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, AbapSystemListItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface GetSapWebDispatcherRelatedResourceRequest {}

interface GetSapWebDispatcherRelatedResourceResponse extends Result<AbapSystemListItem> {}

export default createResultSubscriptionFactory<
  GetSapWebDispatcherRelatedResourceRequest,
  GetSapWebDispatcherRelatedResourceResponse
>({
  eventId: 'getSapWebDispatcherRelatedResourceLists'
});

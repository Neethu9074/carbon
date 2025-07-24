/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, AbapSystemItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface GetParentForSapBreadCrumbRequest {}

interface GetParentForSapBreadCrumbResponse extends Result<AbapSystemItem> {}

export default createResultSubscriptionFactory<GetParentForSapBreadCrumbRequest, GetParentForSapBreadCrumbResponse>({
  eventId: 'getParentForSapBreadCrumb'
});

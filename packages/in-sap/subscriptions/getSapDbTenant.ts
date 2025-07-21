/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, SapDbItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface GetDbTenantRequest {}

interface GetDbTenantResponse extends Result<SapDbItem> {}

export default createResultSubscriptionFactory<GetDbTenantRequest, GetDbTenantResponse>({
  eventId: 'getSapDbTenant'
});

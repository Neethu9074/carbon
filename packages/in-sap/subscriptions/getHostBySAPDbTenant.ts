/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, SapInfrastructureLink } from 'in-types';

interface GetSapDbTenantHostRequest {}

interface GetSapDbTenantHostResponse extends Result<SapInfrastructureLink> {}

export default createResultSubscriptionFactory<GetSapDbTenantHostRequest, GetSapDbTenantHostResponse>({
  eventId: 'getHostBySAPDbTenant'
});

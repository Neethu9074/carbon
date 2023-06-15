/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, SapInfrastructureLink } from 'in-types';

interface GetSapDbmsHostRequest {}

interface GetSapDbmsHostResponse extends Result<SapInfrastructureLink> {}

export default createResultSubscriptionFactory<GetSapDbmsHostRequest, GetSapDbmsHostResponse>({
  eventId: 'getHostBySAPDbms'
});

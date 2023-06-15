/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, SapInfrastructureLink } from 'in-types';

interface GetSapJavaInstanceHostRequest {}

interface GetSapJavaInstanceHostResponse extends Result<SapInfrastructureLink> {}

export default createResultSubscriptionFactory<GetSapJavaInstanceHostRequest, GetSapJavaInstanceHostResponse>({
  eventId: 'getHostBySapJavaInstance'
});

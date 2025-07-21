/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, SapInfrastructureLink } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface GetSapWebDispatcherHostRequest {}

interface GetSapWebDispatcherHostResponse extends Result<SapInfrastructureLink> {}
export default createResultSubscriptionFactory<GetSapWebDispatcherHostRequest, GetSapWebDispatcherHostResponse>({
  eventId: 'getHostsBySapWebDispatcher'
});

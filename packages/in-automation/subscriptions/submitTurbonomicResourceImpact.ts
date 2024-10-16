/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { AgentRequest, ResourceImpactRsp, Result } from '@instana/types';

import createSubscription from 'in-subscription/subscription';

export default createSubscription<AgentRequest, Result<ResourceImpactRsp>>({
  eventId: 'submitTurbonomicResourceImpact'
});

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { GetJsAgentVersionsQuery, Result, JsAgentVersions } from 'in-types';

export default createResultSubscriptionFactory<GetJsAgentVersionsQuery, Result<JsAgentVersions>>({
  eventId: 'getJsAgentVersionsInfo',
  trackSubscriptionStatistics: true
});

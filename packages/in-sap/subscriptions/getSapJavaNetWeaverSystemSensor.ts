/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, AbapSystemItem } from 'in-types';

interface GetSapJavaNetWeaverSensorSystemRequest {}

interface GetSapJavaNetWeaverSensorSystemResponse extends Result<AbapSystemItem> {}

export default createResultSubscriptionFactory<
  GetSapJavaNetWeaverSensorSystemRequest,
  GetSapJavaNetWeaverSensorSystemResponse
>({
  eventId: 'getSapJavaNetWeaverSystemSensor'
});

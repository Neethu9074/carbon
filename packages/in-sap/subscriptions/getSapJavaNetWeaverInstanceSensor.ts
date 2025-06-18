/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, SapJavaInstanceItem } from 'in-types';

interface GetSapJavaNetWeaverInstanceSensorRequest {}

interface GetSapJavaNetWeaverInstanceSensorResponse extends Result<SapJavaInstanceItem> {}

export default createResultSubscriptionFactory<
  GetSapJavaNetWeaverInstanceSensorRequest,
  GetSapJavaNetWeaverInstanceSensorResponse
>({
  eventId: 'getSapJavaNetWeaverInstanceSensor'
});

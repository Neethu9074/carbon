/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Result, SapJavaInstanceItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface GetSapJavaNetWeaverInstanceSensorRequest {}

interface GetSapJavaNetWeaverInstanceSensorResponse extends Result<SapJavaInstanceItem> {}

export default createResultSubscriptionFactory<
  GetSapJavaNetWeaverInstanceSensorRequest,
  GetSapJavaNetWeaverInstanceSensorResponse
>({
  eventId: 'getSapJavaNetWeaverInstanceSensor'
});

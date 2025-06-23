/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, AbapSystemListItem } from 'in-types';

interface GetSapJavaNetWeaverSensorRequest {}

interface GetSapJavaNetWeaverSensorResponse extends Result<AbapSystemListItem> {}

export default createResultSubscriptionFactory<GetSapJavaNetWeaverSensorRequest, GetSapJavaNetWeaverSensorResponse>({
  eventId: 'getSapAbapSensor'
});

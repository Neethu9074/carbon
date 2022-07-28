/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, SyntheticTest } from 'in-types';

interface CreateResultSubscriptionFactoryRequest {
  testId: string;
}

interface CreateResultSubscriptionFactoryResponse extends Result<SyntheticTest> {}

export default createResultSubscriptionFactory<
  CreateResultSubscriptionFactoryRequest,
  CreateResultSubscriptionFactoryResponse
>({
  eventId: 'getSyntheticTest',
  trackSubscriptionStatistics: true
});

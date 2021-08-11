/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, ServiceLabel } from 'in-types';

interface CreateResultSubscriptionFactoryRequest {
  id: string;
}

interface CreateResultSubscriptionFactoryResponse extends Result<ServiceLabel> {}

export default createResultSubscriptionFactory<
  CreateResultSubscriptionFactoryRequest,
  CreateResultSubscriptionFactoryResponse
>({
  eventId: 'getServiceLabel',
  memoizeFor: 100,
  trackSubscriptionStatistics: true
});

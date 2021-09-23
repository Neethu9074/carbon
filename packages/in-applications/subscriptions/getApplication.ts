/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Application, Result } from 'in-types';

interface CreateResultSubscriptionFactoryRequest {
  id: string;
}

interface CreateResultSubscriptionFactoryResponse extends Result<Application> {}

export default createResultSubscriptionFactory<
  CreateResultSubscriptionFactoryRequest,
  CreateResultSubscriptionFactoryResponse
>({
  eventId: 'getApplication',
  trackSubscriptionStatistics: true
});

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Application, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

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

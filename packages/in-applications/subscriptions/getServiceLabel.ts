/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Result, ServiceLabel } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface GetServiceLabelRequest {
  id: string;
}

type GetServiceLabelResponse = Result<ServiceLabel>;

export default createResultSubscriptionFactory<GetServiceLabelRequest, GetServiceLabelResponse>({
  eventId: 'getServiceLabel',
  memoizeFor: 100,
  trackSubscriptionStatistics: true
});

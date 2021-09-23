/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, ServiceLabel } from 'in-types';

interface GetServiceLabelRequest {
  id: string;
}

type GetServiceLabelResponse = Result<ServiceLabel>;

export default createResultSubscriptionFactory<GetServiceLabelRequest, GetServiceLabelResponse>({
  eventId: 'getServiceLabel',
  memoizeFor: 100,
  trackSubscriptionStatistics: true
});

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, LegacyAlertStats } from 'in-types';

// yes, indeed, the requests is empty
interface CreateResultSubscriptionFactoryRequest {}

interface CreateResultSubscriptionFactoryResponse extends Result<LegacyAlertStats> {}

export default createResultSubscriptionFactory<
  CreateResultSubscriptionFactoryRequest,
  CreateResultSubscriptionFactoryResponse
>({
  eventId: 'getLegacyAlertConfigStats',
  trackSubscriptionStatistics: true
});

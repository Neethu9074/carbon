/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getAlertConfigFromLegacyEvent',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getAppDataEntityChains',
  trackSubscriptionStatistics: false // setting it to true would lead to this error:
  // [error] in-services/unhandledErrors :: Unhandled error: Uncaught TypeError: Cannot read property 'loading' of undefined
  // at webpack:///./packages/in-services/tracking/ineum/resultSubscriptionStatsTracking.js?:56 TypeError: Cannot read property 'loading' of undefined
});

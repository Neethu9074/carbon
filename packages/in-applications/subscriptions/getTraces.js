/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getTraces',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});

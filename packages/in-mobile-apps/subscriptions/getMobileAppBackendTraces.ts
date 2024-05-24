/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetEumBeaconBackendTracesQuery, Result, BackendTrace } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetEumBeaconBackendTracesQuery, Result<BackendTrace[]>>({
  eventId: 'getEumBeaconBackendTraces',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});

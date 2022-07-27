/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetServiceMapQuery, ServiceMap, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetServiceMapQuery, Result<ServiceMap>>({
  eventId: 'getServiceMap',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});

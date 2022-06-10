/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetServiceQuery, Result, Service } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetServiceQuery, Result<Service>>({
  eventId: 'getService',
  trackSubscriptionStatistics: true
});

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetServiceQuery, PaginatedResult, Result, ServicePreviewItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

// This is a custom Query as some fields are specifically set in the backend
// See -> GetServicePreviewsSubscribeEvent.java
// https://github.ibm.com/instana/backend/blob/2c5a129df18ff7fb4d60f0b75e39df3d2bdf4fe6/ui-backend/src/main/java/com/instana/ui/websocket/events/incoming/application/GetServicePreviewsSubscribeEvent.java
type GetServicePreviewQuery = Omit<GetServiceQuery, 'contextScope' | 'metrics'>;

export default createResultSubscriptionFactory<GetServicePreviewQuery, Result<PaginatedResult<ServicePreviewItem>>>({
  eventId: 'getServicePreviews',
  trackSubscriptionStatistics: true
});

// TODO move out of application

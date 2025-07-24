/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Result, TraceActivityTreeNodeDetails } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface createResultSubscriptionFactoryRequest {
  traceId: string;
  nodeId: string;
  retry?: number;
}

type createResultSubscriptionFactoryResponse = Result<TraceActivityTreeNodeDetails>;

export default createResultSubscriptionFactory<
  createResultSubscriptionFactoryRequest,
  createResultSubscriptionFactoryResponse
>({
  eventId: 'getTraceActivityTreeNodeDetails',
  trackSubscriptionStatistics: true,
  disposeSubscriptionOnDocumentHidden: false
});

// TODO move to analyze

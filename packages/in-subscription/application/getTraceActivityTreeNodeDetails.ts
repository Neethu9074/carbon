/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, TraceActivityTreeNodeDetails } from 'in-types';

interface createResultSubscriptionFactoryRequest {
  traceId: string;
  nodeId: string;
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

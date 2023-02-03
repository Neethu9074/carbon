/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { FlowNode, GetFlowMapNodesQuery, PaginatedResult, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetFlowMapNodesQuery, Result<PaginatedResult<FlowNode>>>({
  eventId: 'getEndpointFlowNodes',
  memoizeFor: 100,
  trackSubscriptionStatistics: true
});

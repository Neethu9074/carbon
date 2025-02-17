/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Result, TimeConfig } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

// TODO: This type will be generated
interface BusinessFlowMapQuery {
  processDefinitionId: string;
  timeConfig: TimeConfig;
  nodePagination: {
    originNodeId?: number;
    maxNodes: number;
  };
}

interface BusinessFlowMapNode {
  id: string;
  pluginId: string;
  remainingTargetCount: number;
}

interface BusinessFlowMapEdge {
  id: string;
  source: string;
  target: string;
}

export interface BusinessFlowMap {
  graph: {
    nodes: BusinessFlowMapNode[];
    edges: BusinessFlowMapEdge[];
  };
  originNodeId: string;
  hits: number;
  totalGraphSize: number;
}

export default createResultSubscriptionFactory<BusinessFlowMapQuery, Result<BusinessFlowMap>>({
  eventId: 'getBusinessFlowMap',
  trackSubscriptionStatistics: true
});

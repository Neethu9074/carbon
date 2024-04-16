/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Application, Endpoint, Result, ServiceLabel } from '@instana/types';

export interface UrlMatrixParamConfig {
  path: string;
  paramTab: string;
  paramMetric: string;
}

export type WithLabel = Result<Application | Endpoint | ServiceLabel>;

// #region Application Map
export interface APMapNode {
  id: string;
  x: number;
  y: number;
}

export interface APMapGraphNode extends APMapNode {
  size: number;
  inNode: APMapNode;
  fixed: boolean;
  fr_x: number;
  fr_y: number;
  fr: { dx: number; dy: number };
}

export interface APMapEdge {
  id: string;
  from: APMapNode;
  to: APMapNode;
}
export interface APMapGraphEdge {
  id: number;
  source: string;
  target: string;
}

export interface ApplicationMapNodePosition {
  x: number;
  y: number;
}

export interface ApplicationMapGraph {
  nodes: APMapGraphNode[];
  nodeMap: Map<string, APMapGraphNode>;
  edges: APMapGraphEdge[];
}

export interface ApplicationMapDimensions {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface TransformedAPMapNode {
  name: string;
  rank: number;
  inNode: APMapNode;
  outgoingConnections: TransformedAPMapNode[];
  incomingConnections: TransformedAPMapNode[];
  __touched: boolean;
  connected?: boolean;
  x?: number;
  y?: number;
}

export interface APMapEdgeLookUpTable {
  incoming: Record<string, string>;
  outgoing: Record<string, string>;
}

export interface APMapGraphColumnInfo {
  rank: number;
  nodes: TransformedAPMapNode[];
}
// #endregion

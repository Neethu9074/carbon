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
export interface ApplicationMapNode {
  id: string;
  x: number;
  y: number;
}

export interface ApplicationMapGraphNode extends ApplicationMapNode {
  size: number;
  inNode: ApplicationMapNode;
  fixed: boolean;
  fr_x: number;
  fr_y: number;
  fr: { dx: number; dy: number };
}

export interface ApplicationMapEdge {
  id: string;
  from: ApplicationMapNode;
  to: ApplicationMapNode;
}
export interface ApplicationMapGraphEdge {
  id: number;
  source: string;
  target: string;
}

export interface ApplicationMapNodePosition {
  x: number;
  y: number;
}

export interface ApplicationMapGraph {
  nodes: ApplicationMapGraphNode[];
  nodeMap: Map<string, ApplicationMapGraphNode>;
  edges: ApplicationMapGraphEdge[];
}

export interface ApplicationMapDimensions {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
// #endregion

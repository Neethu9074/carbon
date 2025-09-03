/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ElkNode } from 'elkjs/lib/elk.bundled';

import { Event } from '@instana/types';

// Base entity type from existing utils
export interface EntityIdWithSnapshotId {
  steadyId: string;
  pluginId: string;
  snapshotId: string;
  host: string;
}

// Node with ID for topology visualization
export interface NodeWithId extends EntityIdWithSnapshotId {
  id: string;
  tags?: string[]; // Optional tags array to identify node types (e.g., ["rca"] for root cause)
}

// Edge definition for connecting nodes
export interface Edge {
  source: string;
  target: string;
  id?: string;
}

// Topology data structure containing nodes and edges
export interface TopologyData {
  nodes: NodeWithId[];
  edges: Edge[];
}

// Extended ElkNode with our custom properties
export interface TopologyNode extends ElkNode {
  originalNode?: NodeWithId;
}

// Props for the NewTopology component
export interface NewTopologyProps {
  incident: Event;
}

// Props for the SimpleTopologyVisualization component
export interface SimpleTopologyVisualizationProps {
  nodes: NodeWithId[];
  edges: Edge[];
  width?: string;
  height?: string;
}

// Transform state for zoom/pan operations
export interface TransformState {
  x: number;
  y: number;
  k: number;
}

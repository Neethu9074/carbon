/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Event } from '@instana/types';

import {
  EntityIdWithSnapshotId,
  NodeWithId,
  Edge,
  TopologyData
} from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/NewTopology/types';
import { getRootCauses } from 'in-events/components/RootCauseAnalysis/utils/getRootCauses';

/**
 * Generate a unique ID for a node based on its properties
 */
export const generateNodeId = (node: EntityIdWithSnapshotId): string => {
  const parts: string[] = [];

  // Add all available properties to the ID
  if (node.steadyId) parts.push(node.steadyId);
  if (node.pluginId) parts.push(node.pluginId);
  if (node.snapshotId) parts.push(node.snapshotId);
  if (node.host) parts.push(node.host);

  // Create a simple hash by joining all parts
  return parts.join('-');
};

/**
 * Add a unique ID to each node based on its properties
 */
export const addIdToNode = (node: EntityIdWithSnapshotId, tags?: string[]): NodeWithId => {
  // Generate ID based on node properties only (not using index)
  const id = generateNodeId(node);

  return {
    ...node,
    id,
    tags
  };
};

/**
 * Build edges between nodes in a sequential array
 */
export const buildEdges = (nodes: NodeWithId[]): Edge[] => {
  // in an array, first node connects to second, and so on
  if (!nodes || nodes.length < 2) {
    return [];
  }

  const edges: Edge[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      source: nodes[i].id,
      target: nodes[i + 1].id
    });
  }

  return edges;
};

/**
 * Check if an edge already exists in the edges array
 */
export const edgeExists = (edges: Edge[], newEdge: Edge): boolean => {
  return edges.some(edge => edge.source === newEdge.source && edge.target === newEdge.target);
};

/**
 * Check if a node is a duplicate based on its ID
 */
export const isNodeDuplicate = (existingNodes: NodeWithId[], newNode: NodeWithId): boolean => {
  // Check if a node with the same ID already exists
  return existingNodes.findIndex(node => node.id === newNode.id) !== -1;
};

/**
 * Extract edges and nodes from the incident data
 */
export const getEdgesAndNodes = (incident: Event): TopologyData => {
  const rootCauses = getRootCauses(incident);

  const nodes: NodeWithId[] = [];
  const edges: Edge[] = [];

  rootCauses.forEach(rca => {
    // First, create nodes from root cause content (entityID keys + snapshotId)
    if (rca.entityID) {
      // Create a node for the root cause entity with "rca" tag
      const rcaNode = addIdToNode(
        {
          ...rca.entityID,
          snapshotId: rca.snapshotId
        },
        ['rca'] // Add "rca" tag to identify root cause nodes
      );

      // Add the root cause node if it doesn't already exist
      if (!isNodeDuplicate(nodes, rcaNode)) {
        nodes.push(rcaNode);
      }
    }

    // Add IDs to each node in the shortest path
    const rcaNodesWithIds =
      rca.topology?.shortestPath.map((node, index) => {
        // First one is always the triggering entity
        return addIdToNode(node, index === 0 ? ['triggering'] : []);
      }) || [];

    // Add nodes to the main nodes array if they don't already exist
    rcaNodesWithIds.forEach(node => {
      if (!isNodeDuplicate(nodes, node)) {
        nodes.push(node);
      }
    });

    // Build edges between nodes and add only unique edges
    const rcaEdges = buildEdges(rcaNodesWithIds);
    rcaEdges.forEach(edge => {
      if (!edgeExists(edges, edge)) {
        edges.push(edge);
      }
    });
  });

  return {
    nodes,
    edges
  };
};

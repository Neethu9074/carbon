/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  APMapEdge,
  APMapGraphEdge,
  APMapNode,
  TransformedAPMapNode,
  APMapEdgeLookUpTable,
  APMapGraphColumnInfo
} from 'in-applications/types';

const DISCONNECTED_NODES_RANK = -1;
const DEFAULT_NODES_RANK = 0;
const DISTANCE_BETWEEN_ROWS = 2.5;
const DISTANCE_BETWEEN_COLUMNS = 8;

export function transformNodes(_nodes: Map<string, APMapNode>, _edges: Map<string, APMapEdge>) {
  const LUT: Record<string, TransformedAPMapNode> = {};
  const LUTAsArray: TransformedAPMapNode[] = [];
  let index = 0;

  const nodeSceneObjects = _nodes.values();
  for (const node of nodeSceneObjects) {
    const transformedNode: TransformedAPMapNode = {
      name: node.id,
      rank: DEFAULT_NODES_RANK,
      inNode: node,
      outgoingConnections: [],
      incomingConnections: [],
      __touched: false
    };
    LUT[node.id] = transformedNode;
    LUTAsArray[index++] = transformedNode;
  }

  for (let i = 0, length = LUTAsArray.length; i < length; i++) {
    const transformedNode = LUTAsArray[i];
    const nodeId = transformedNode.inNode.id;
    if (!nodeId) {
      continue;
    }

    const edgeSceneObjects = _edges.values();
    for (let edge of edgeSceneObjects) {
      const source = edge.from.id;
      const destination = edge.to.id;
      if (LUT[destination]) {
        transformedNode.outgoingConnections.push(LUT[destination]);
      }
      if (LUT[source]) {
        transformedNode.outgoingConnections.push(LUT[source]);
      }
    }
  }

  return {
    list: LUTAsArray,
    LUT
  };
}

export function transformEdges(_edges: Map<string, APMapEdge>) {
  const graphEdges: APMapGraphEdge[] = Array.from(_edges.values()).map((edge, i) => ({
    id: i,
    source: edge.from.id,
    target: edge.to.id
  }));

  const LUT: APMapEdgeLookUpTable = {
    outgoing: {},
    incoming: {}
  };

  graphEdges.forEach(edge => {
    LUT.outgoing[edge.source] = edge.target;
    LUT.incoming[edge.target] = edge.source;
  });

  return {
    list: graphEdges,
    LUT
  };
}

export function calcRanks(nodes: TransformedAPMapNode[], vizceralPosition: Record<string, any>) {
  for (let iN = 0, lengthN = nodes.length; iN < lengthN; iN++) {
    const node = nodes[iN];
    const position = vizceralPosition[node.name];
    let isDisconnected = false;

    if (!position || (node.outgoingConnections.length === 0 && node.incomingConnections.length === 1)) {
      isDisconnected = true;
    }

    if (isDisconnected) {
      node.rank = DISCONNECTED_NODES_RANK;
    } else {
      node.rank = position.x;
    }
  }
}

export function applyRanks(
  nodes: TransformedAPMapNode[],
  nodesLUT: Record<string, TransformedAPMapNode>,
  edgesLUT: APMapEdgeLookUpTable
) {
  let columns: Record<number, APMapGraphColumnInfo> = {};

  for (let iN = 0, lengthN = nodes.length; iN < lengthN; iN++) {
    const node = nodes[iN];
    if (!columns[node.rank]) {
      columns[node.rank] = {
        rank: node.rank,
        nodes: []
      };
    }
    columns[node.rank].nodes.push(node);
  }

  const sortedColumns = Object.keys(columns)
    .filter(rank => Number(rank) >= 0)
    .map(rank => columns[Number(rank)])
    .sort((c1, c2) => c1.rank - c2.rank);

  applyColumns(nodesLUT, sortedColumns, edgesLUT);
  applyDisconnected(columns[DISCONNECTED_NODES_RANK]);
}

function applyColumns(
  nodesLUT: Record<string, TransformedAPMapNode>,
  columns: APMapGraphColumnInfo[],
  edgesLUT: APMapEdgeLookUpTable
) {
  if (columns.length === 0) {
    return;
  }

  //first column is ordered by connections
  const firstColumnNodes = columns[0].nodes.sort(
    (n1, n2) => n2.outgoingConnections.length - n1.outgoingConnections.length
  );
  for (let iN = 0, lengthN = firstColumnNodes.length; iN < lengthN; iN++) {
    const node = firstColumnNodes[iN];
    node.x = 0;
    node.y = iN * DISTANCE_BETWEEN_ROWS;
  }

  // each following column is aligned to the previous connected
  for (let iC = 1, lengthC = columns.length; iC < lengthC; iC++) {
    const x = iC * DISTANCE_BETWEEN_COLUMNS;
    const occupiedPositions = [];
    const column = columns[iC];

    for (let iN = 0, lengthN = column.nodes.length; iN < lengthN; iN++) {
      const node = column.nodes[iN];
      const connectedNode = nodesLUT[edgesLUT.incoming[node.name]];
      const y = connectedNode && connectedNode.y ? connectedNode.y : undefined;

      node.x = x;
      if (y) {
        node.y = occupiedPositions[y] ? undefined : y;
        occupiedPositions[y] = true;
      } else {
        node.y = undefined;
      }
    }

    for (let iN = 0, lengthN = column.nodes.length; iN < lengthN; iN++) {
      const node = column.nodes[iN];
      let index = 0;
      while (node.y === undefined) {
        const y = index++ * DISTANCE_BETWEEN_ROWS;
        if (!occupiedPositions[y]) {
          node.y = y;
          occupiedPositions[y] = true;
        }
      }
    }
  }
}

function applyDisconnected(disconnectedNodes: APMapGraphColumnInfo) {
  if (disconnectedNodes) {
    const x = -DISTANCE_BETWEEN_COLUMNS;
    for (let iN = 0, lengthN = disconnectedNodes.nodes.length; iN < lengthN; iN++) {
      const node = disconnectedNodes.nodes[iN];
      node.x = x;
      node.y = iN * DISTANCE_BETWEEN_ROWS;
    }
  }
}

export function centerNodesX(nodes: TransformedAPMapNode[]) {
  let maxX = 0;
  let minX = Number.MAX_VALUE;

  for (let i = 0, length = nodes.length; i < length; i++) {
    const item = nodes[i];
    maxX = Math.max(maxX, Number(item.x));
    minX = Math.min(minX, Number(item.x));
  }
  const width = maxX - minX;

  for (let iN = 0, lengthN = nodes.length; iN < lengthN; iN++) {
    const node = nodes[iN];
    node.x = Number(node.x) - minX - width / 2;
  }
}

export function translateNodesY(nodes: TransformedAPMapNode[], offset: number) {
  nodes.forEach(node => (node.y = Number(node.y) + offset));
}

export function applyPosition(nodes: TransformedAPMapNode[]) {
  for (let iN = 0, lengthN = nodes.length; iN < lengthN; iN++) {
    const node = nodes[iN];
    // add noise to the screen y position to avoid orthogonal lines
    const noise = 0.1 * Math.random();
    node.inNode.x = Number(node.x);
    node.inNode.y = Number(node.y) + noise;
  }
}

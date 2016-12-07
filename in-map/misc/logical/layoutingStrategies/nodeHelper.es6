const DISCONNECTED_NODES_RANK = -10;
const UNKNOWN_NODES_RANK = -5;
const DEFAULT_NODES_RANK = 0;
const DISTANCE_BETWEEN_ROWS = 4;
const DISTANCE_BETWEEN_COLUMNS = 20;
const DISTANCE_OF_UNCONNECTED_NODES = 3;

export function transformNodes(_nodes, _edges) {
  const LUT = {};
  for (let iN = 0, nodesLength = _nodes.length; iN < nodesLength; iN++) {
    const node = _nodes[iN];
    const transformedNode = {
      name: node.id,
      rank: DEFAULT_NODES_RANK,
      inNode: node,
      outgoingConnections: [],
      incomingConnections: [],
      __touched: false
    };
    LUT[node.id] = transformedNode;
  }

  const transformedNodesAsList = Object.keys(LUT).map(key => LUT[key]);
  transformedNodesAsList.forEach(transformedNode => {
    const nodeId = transformedNode.inNode.id;

    for (let iE = 0, edgesLength = _edges.length; iE < edgesLength; iE++) {
      const source = _edges[iE].sourceNode.id;
      const destination = _edges[iE].destinationNode.id;

      ((source === nodeId) && LUT[destination])
        ? transformedNode.outgoingConnections.push(LUT[destination])
        : null;

      ((destination === nodeId) && LUT[source])
        ? transformedNode.incomingConnections.push(LUT[source])
        : null;
    }
  });

  return {
    list: transformedNodesAsList,
    LUT
  };
}

export function transformEdges(edges) {
  const LUT = {
    outgoing: {},
    incoming: {}
  };

  return {
    list: edges.map(edge => {
      edge = {
        source: edge.sourceNode.id,
        target: edge.destinationNode.id
      };

      LUT.outgoing[edge.source] = edge.target;
      LUT.incoming[edge.target] = edge.source;
      return edge;
    }),
    LUT
  };
}

export function calcRanks(nodes, vizceralPosition) {
  for (let iN = 0, lengthN = nodes.length; iN < lengthN; iN++) {
    const node = nodes[iN];
    const position = vizceralPosition[node.name];
    let isDisconnected = false;

    if (!position ||
        (node.outgoingConnections.length === 0 &&
         node.incomingConnections.length === 1 &&
         isUnknownOrEum(node.incomingConnections[0])
      )) {
      isDisconnected = true;
    }

    if (isUnknownOrEum(node)) {
      node.rank = UNKNOWN_NODES_RANK;
    } else if (isDisconnected) {
      node.rank = DISCONNECTED_NODES_RANK;
    } else {
      node.rank = position.x;
    }
  }
}

export function applyRanks(nodes, nodesLUT, edges, edgesLUT) {
  let columns = {};

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

  const sortedColumns = Object.keys(columns).filter(rank => Number(rank) >= 0)
                                            .map(rank => columns[rank])
                                            .sort((c1, c2) => c1.rank - c2.rank);

  applyColumns(nodesLUT, sortedColumns, edgesLUT);
  applyDisconnected(columns[DISCONNECTED_NODES_RANK]);
  applyUnknown(nodesLUT, columns[UNKNOWN_NODES_RANK], edgesLUT);
}

function applyColumns(nodesLUT, columns, edgesLUT) {
  if (columns.length === 0) {
    return;
  }

  //first column is ordered by connections
  const firstColumnNodes = columns[0].nodes.sort((n1, n2) => n2.outgoingConnections.length - n1.outgoingConnections.length);
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
      while(node.y === undefined) {
        const y = index++ * DISTANCE_BETWEEN_ROWS;
        if (!occupiedPositions[y]) {
          node.y = y;
          occupiedPositions[y] = true;
        }
      }
    }
  }
}

function applyDisconnected(disconnectedNodes) {
  if (disconnectedNodes) {
    const x = -5 * DISTANCE_OF_UNCONNECTED_NODES;
    for (let iN = 0, lengthN = disconnectedNodes.nodes.length; iN < lengthN; iN++) {
      const node = disconnectedNodes.nodes[iN];
      node.x = x;
      node.y = iN * DISTANCE_BETWEEN_ROWS;
    }
  }
}

function applyUnknown(nodesLUT, unknownNodes, edgesLUT) {
  if (unknownNodes) {
    for (let iN = 0, lengthN = unknownNodes.nodes.length; iN < lengthN; iN++) {
      const node = unknownNodes.nodes[iN];
      const connectedNode = nodesLUT[edgesLUT.outgoing[node.name]];

      node.x = connectedNode ? connectedNode.x - DISTANCE_OF_UNCONNECTED_NODES : -DISTANCE_OF_UNCONNECTED_NODES;
      node.y = connectedNode ? connectedNode.y : iN * 2;
    }
  }
}

export function centerNodes(nodes) {
  let maxX = 0;
  let maxY = 0;
  let minX = Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;

  for (let i = 0, length = nodes.length; i < length; i++) {
    const item = nodes[i];
    maxX = Math.max(maxX, item.x);
    maxY = Math.max(maxY, item.y);
    minX = Math.min(minX, item.x);
    minY = Math.min(minY, item.y);
  }
  const width = maxX - minX;
  const height = maxY - minY;

  for (let iN = 0, lengthN = nodes.length; iN < lengthN; iN++) {
    const node = nodes[iN];
    node.x = node.x - minX - (width / 2);
    node.y = node.y - minY - (height / 2);
  }
}

export function applyPosition(nodes) {
  for (let iN = 0, lengthN = nodes.length; iN < lengthN; iN++) {
    const node = nodes[iN];
    node.inNode.getComponent('transform').setPositionXYZ(node.x, 0, node.y);
  }
}

export function createSubGraphs(nodes) {
  const subGraphs = [];

  for (let i = 0, length = nodes.length; i < length; i++) {
    const node = nodes[i];
    if (node.__touched) {
      continue;
    }

    const graph = {
      nodes: [],
      connections: []
    };
    addConnected(node, graph);
    subGraphs.push(graph);
  }

  return subGraphs;
}

export function addConnected(node, graph) {
  if (node.__touched) {
    return;
  }

  node.__touched = true;
  graph.nodes.push(node);

  for (let i = 0, length = node.outgoingConnections.length; i < length; i++) {
    const target = node.outgoingConnections[i];
    graph.connections.push({
      source: node.inNode.id,
      target: target.inNode.id
    });
    addConnected(target, graph);
  }
  for (let i = 0, length = node.incomingConnections.length; i < length; i++) {
    addConnected(node.incomingConnections[i], graph);
    const source = node.incomingConnections[i];
    graph.connections.push({
      source: source.inNode.id,
      target: node.inNode.id
    });
  }
}

function isUnknownOrEum(node) {
  return node.inNode.isUnknown || node.inNode.isEum;
}

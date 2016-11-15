export function transformNodes(_nodes, _edges) {
  const transformedNodes = {};
  for (let iN = 0, nodesLength = _nodes.length; iN < nodesLength; iN++) {
    const node = _nodes[iN];
    const transformedNode = {
      name: node.id,
      inNode: node,
      outgoingConnections: [],
      incomingConnections: [],
      __touched: false
    };
    transformedNodes[node.id] = transformedNode;
  }

  const transformedNodesAsList = Object.keys(transformedNodes).map(key => transformedNodes[key]);
  transformedNodesAsList.forEach(transformedNode => {
    const nodeId = transformedNode.inNode.id;

    for (let iE = 0, edgesLength = _edges.length; iE < edgesLength; iE++) {
      const source = _edges[iE].sourceNode.id;
      const destination = _edges[iE].destinationNode.id;

      ((source === nodeId) && transformedNodes[destination])
        ? transformedNode.outgoingConnections.push(transformedNodes[destination])
        : null;

      ((destination === nodeId) && transformedNodes[source])
        ? transformedNode.incomingConnections.push(transformedNodes[source])
        : null;
    }
  });
  return transformedNodesAsList;
}

export function transformEdges(edges) {
  return edges.map(edge => {
    return {
      source: edge.sourceNode.id,
      target: edge.destinationNode.id
    };
  });
}

export function sortNodes(nodes) {
  rankNodes(nodes);
  nodes.sort((n1, n2) => n1.rank - n2.rank);
}

export function rankNodes(nodes) {
  for (let iN = 0, length = nodes.length; iN < length; iN++) {
    const node = nodes[iN];
    node.rank = -1 * node.outgoingConnections.length + node.incomingConnections.length;
  }
}

export function setRanks(nodes, vizceralPosition) {
  for (let iN = 0, lengthN = nodes.length; iN < lengthN; iN++) {
    const node = nodes[iN];
    const position = vizceralPosition[node.name];
    node.rank = position ? position.x : -1;
  }
}

export function applyRanks(nodes) {
  const distanceBetweenRows = 4;
  const distanceBetweenColumns = 20;
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

  columns = Object.keys(columns).map(column => columns[column])
                                .sort((c1, c2) => c1.rank - c2.rank);


  for (let iC = 0, lengthC = columns.length; iC < lengthC; iC++) {
    const column = columns[iC];

    for (let iN = 0, lengthN = column.nodes.length; iN < lengthN; iN++) {
      const node = column.nodes[iN];
      node.x = iC * distanceBetweenColumns;
      node.y = iN * distanceBetweenRows;
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

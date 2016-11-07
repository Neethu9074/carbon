export default function applyLayout({nodes, edges}) {
  const N = transformNodes(nodes, edges);
  const G = getSubgraphs(N);

  for (let iG = 0, lengthG = G.length; iG < lengthG; iG++) {
    const graphNodes = sortNodes(G[iG]);
    for (let iN = 0, lengthN = graphNodes.length; iN < lengthN; iN++) {
      const node = graphNodes[iN];
      node.inNode.getComponent('transform').setPositionXYZ(iN * 4, 0, iG * 4);
    }
  }
}

function transformNodes(_nodes, _edges) {
  const transformedNodes = {};
  for (let iN = 0, nodesLength = _nodes.length; iN < nodesLength; iN++) {
    const node = _nodes[iN];
    const transformedNode = {
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

function getSubgraphs(_nodes) {
  const subgraphs = [];

  for (let iN = 0, length = _nodes.length; iN < length; iN++) {
    const node = _nodes[iN];
    if (node.__touched) {
      continue;
    }

    const currentGraph = [];
    addConnected(node, currentGraph);
    subgraphs.push(currentGraph);
  }

  return subgraphs;
}


function addConnected(node, graph) {
  if (node.__touched) {
    return;
  }
  node.__touched = true;

  graph.push(node);
  for (let iN = 0, length = node.outgoingConnections.length; iN < length; iN++) {
    addConnected(node.outgoingConnections[iN], graph);
  }
  for (let iN = 0, length = node.incomingConnections.length; iN < length; iN++) {
    addConnected(node.incomingConnections[iN], graph);
  }
}

function sortNodes(nodes) {
  // TODO: sort nodes by flow

  return nodes;
}

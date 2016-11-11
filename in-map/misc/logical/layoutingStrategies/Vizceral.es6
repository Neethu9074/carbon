import LTRTreeLayouter from  'in-map/misc/logical/layoutingStrategies/vizceralResources/ltrTreeLayouter';


export default function applyLayout({nodes, edges}) {
  const N = transformNodes(nodes, edges);
  rankNodes(N);
  sortNodes(N);

  const testLayouter = new LTRTreeLayouter();
  const positions = testLayouter.layout(
    tn(N),
    tc(edges),
    {
      width: 1000,
      height: 1000
    },
    N[0].inNode.id
  );

  for (let iN = 0, lengthN = N.length; iN < lengthN; iN++) {
    const node = N[iN];
    const position = positions[node.inNode.id];
    if (position) {
      const x = (position.x - 500) / 20;
      const y = (position.y - 500) / 10;
      setNodePosition(node, x, y);
    }
  }
}

function setNodePosition(node, x, y) {
  if (node.__layouted) {
    return;
  }

  node.inNode.getComponent('transform').setPositionXYZ(x, 0, y);
  node.__layouted = true;
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

function sortNodes(nodes) {
  rankNodes(nodes);
  nodes.sort((n1, n2) => n1.rank - n2.rank);
}

function rankNodes(nodes) {
  for (let iN = 0, length = nodes.length; iN < length; iN++) {
    const node = nodes[iN];
    node.rank = -1 * node.outgoingConnections.length + node.incomingConnections.length;
  }
}


function tn(nodes) {
  return nodes.map(node => {
    return {
      name: node.inNode.id
    };
  });
}

function tc(connections) {
  return connections.map(connection => {
    return {
      source: connection.sourceNode.id,
      target: connection.destinationNode.id
    };
  });
}

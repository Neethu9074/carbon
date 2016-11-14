import LTRTreeLayouter from  'in-map/misc/logical/layoutingStrategies/vizceralResources/ltrTreeLayouter';


const config = {
  width: 1000,
  height: 1000
};

export default function applyLayout({nodes, edges, createSubgraphs = false}) {
  const layouter = new LTRTreeLayouter();
  const N = transformNodes(nodes, edges);

  createSubgraphs
    ? applySubgraph(N, layouter)
    : applyAll(N, edges, layouter);
}

function applySubgraph(nodes, layouter) {
  const G = createSubGraphs(nodes);

  let yCursor = 0;
  for (let iG = 0, lengthG = G.length; iG < lengthG; iG++) {
    const graph = G[iG];

    rankNodes(graph.nodes);
    sortNodes(graph.nodes);

    const positions = layouter.layout(
      tn(graph.nodes),
      graph.connections,
      config,

      // starting node
      graph.nodes[0].inNode.id
    );

    const dimension = setNodePositions(nodes, positions, 0, yCursor);
    yCursor += dimension.height;
  }
}

function applyAll(nodes, edges, layouter) {
  rankNodes(nodes);
  sortNodes(nodes);

  const positions = layouter.layout(
    tn(nodes),
    edges.map(edge => {
      return {
        source: edge.sourceNode.id,
        target: edge.destinationNode.id
      };
    }),
    config,

    // starting node
    nodes[0].inNode.id
  );

  setNodePositions(nodes, positions);
}

function translatePositionToOrigin(positions) {
  let maxX = 0;
  let maxY = 0;
  let minX = Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;
  const ids = Object.keys(positions);

  ids.forEach(id => {
    maxX = Math.max(maxX, positions[id].x);
    maxY = Math.max(maxY, positions[id].y);
    minX = Math.min(minX, positions[id].x);
    minY = Math.min(minY, positions[id].y);
  });
  const width = maxX - minX;
  const height = maxY - minY;
  ids.forEach(id => {
    positions[id].x = (positions[id].x - minX);
    positions[id].y = (positions[id].y - minY);
  });

  return {
    maxX,
    maxY,
    minX,
    minY,
    width,
    height
  };
}

function setNodePositions(nodes, positions, xOffset = 0, yOffset = 0) {
  const dimensions = translatePositionToOrigin(positions);

  for (let iN = 0, lengthN = nodes.length; iN < lengthN; iN++) {
    const node = nodes[iN];
    const position = positions[node.inNode.id];
    if (position) {
      setNodePosition(
        node,
        (position.x + xOffset) / 25,
        (position.y + yOffset) / 25
      );
    } else {
      // forever alone node
    }
  }
  return dimensions;
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

function createSubGraphs(nodes) {
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

function addConnected(node, graph) {
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

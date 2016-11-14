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

    const dimensions = translatePositionToOrigin(positions);
    setNodePositions(nodes, positions, [], 0, yCursor);
    yCursor += dimensions.height;
  }

  centerNodes(nodes);
  apply(nodes);
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

  translatePositionToOrigin(positions);
  const nodesWithoutConnections = [];
  setNodePositions(nodes, positions, nodesWithoutConnections);
  setNodesWithoutConnections(nodesWithoutConnections);
  centerNodes(nodes);
  apply(nodes);
}

function translatePositionToOrigin(positions) {
  const dimensions = calcDimensions(Object.keys(positions).map(key => positions[key]));

  Object.keys(positions).map(key => positions[key]).forEach(position => {
    position.x -= dimensions.minX;
    position.y -= dimensions.minY;
  });

  return dimensions;
}

function setNodePositions(nodes, positions, nodesWithoutConnections, xOffset = 0, yOffset = 0) {
  for (let iN = 0, lengthN = nodes.length; iN < lengthN; iN++) {
    const node = nodes[iN];
    const position = positions[node.inNode.id];
    if (position) {
      node.x = (position.x + xOffset) / 25;
      node.y = (position.y + yOffset) / 25;
    } else {
      // forever alone node
      nodesWithoutConnections.push(node);
    }
  }
}

function centerNodes(nodes) {
  const dimensions = calcDimensions(nodes);
  for (let iN = 0, lengthN = nodes.length; iN < lengthN; iN++) {
    const node = nodes[iN];
    node.x = node.x - dimensions.minX - (dimensions.width / 2);
    node.y = node.y - dimensions.minY - (dimensions.height / 2);
  }
}

function calcDimensions(items) {
  let maxX = 0;
  let maxY = 0;
  let minX = Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;

  for (let i = 0, length = items.length; i < length; i++) {
    const item = items[i];
    maxX = Math.max(maxX, item.x);
    maxY = Math.max(maxY, item.y);
    minX = Math.min(minX, item.x);
    minY = Math.min(minY, item.y);
  }
  const width = maxX - minX;
  const height = maxY - minY;

  return { maxX, maxY, minX, minY, width, height };
}

function setNodesWithoutConnections(nodes) {
  if (nodes.length > 0) {
    console.log('set nodes', nodes);
  }
  for (let iN = 0, lengthN = nodes.length; iN < lengthN; iN++) {
    const node = nodes[iN];
    node.x = iN * 3;
    node.y = -3;
  }
}

function apply(nodes) {
  for (let iN = 0, lengthN = nodes.length; iN < lengthN; iN++) {
    const node = nodes[iN];
    if (node.__layouted) {
      continue;
    }

    node.inNode.getComponent('transform').setPositionXYZ(node.x, 0, node.y);
    node.__layouted = true;
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

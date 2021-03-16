/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable complexity */
const ITERATIONS = 1000;
const SPEED = 0.1;
const SCALE = 2;

export default {
  applyLayout,
  getCameraPositionByDimensions
};

function applyLayout({ nodes, edges, positionsMap }) {
  const sigmaGraph = buildSigmaGraphStructure(nodes, edges, positionsMap);
  start(sigmaGraph);
  applyPositionUpdate(sigmaGraph, positionsMap);
}

function buildSigmaGraphStructure(nodes, edges, positionsMap) {
  const graph = {
    nodes: [],
    nodeMap: {},
    edges: []
  };

  const nodeSceneObjects = nodes.values();
  for (const node of nodeSceneObjects) {
    const storedNodePosition = positionsMap.get(node.id);

    const sigmaNode = {
      id: node.id,
      x: Math.random(),
      y: Math.random(),
      size: 1,
      inNode: node
    };
    graph.nodeMap[node.id] = sigmaNode;
    graph.nodes.push(sigmaNode);

    if (storedNodePosition) {
      sigmaNode.fixed = true;
      sigmaNode.x = storedNodePosition.x;
      sigmaNode.y = storedNodePosition.y;
    }
  }

  let edgeIdCounter = 0;
  const edgeSceneObjects = edges.values();
  for (const edge of edgeSceneObjects) {
    graph.edges.push({
      id: edgeIdCounter++,
      source: edge.from.id,
      target: edge.to.id
    });
  }

  return graph;
}

function start(graph) {
  // Init nodes
  graph.nodes.forEach(node => {
    node.fr_x = node.x / SCALE;
    node.fr_y = node.y / SCALE;
    node.fr = {
      dx: 0,
      dy: 0
    };
  });

  go(graph);
}

function go(graph) {
  const nodesCount = graph.nodes.length;
  const area = nodesCount * nodesCount;
  const maxDisplace = nodesCount / 10;
  const k = Math.sqrt(area / (1 + nodesCount));
  const gravity = 10 * nodesCount;

  let i = 0;
  while (i < ITERATIONS && !atomicGo(graph, maxDisplace, k, gravity)) {
    i++;
  }
}

function atomicGo(graph, maxDisplace, k, gravity) {
  const nodes = graph.nodes;
  const edges = graph.edges;
  const nodesCount = nodes.length;
  const edgesCount = edges.length;
  let i;
  let j;
  let n;
  let n2;
  let e;
  let xDist;
  let yDist;
  let dist;
  let repulsiveF;

  for (i = 0; i < nodesCount; i++) {
    n = nodes[i];

    // Init
    if (!n.fr) {
      n.fr_x = n.x;
      n.fr_y = n.y;
      n.fr = {
        dx: 0,
        dy: 0
      };
    }

    for (j = 0; j < nodesCount; j++) {
      n2 = nodes[j];

      // Repulsion force
      if (n.id !== n2.id) {
        xDist = n.fr_x - n2.fr_x;
        yDist = n.fr_y - n2.fr_y;
        dist = Math.sqrt(xDist * xDist + yDist * yDist) + 0.01;
        // var dist = Math.sqrt(xDist * xDist + yDist * yDist) - n1.size - n2.size;

        if (dist > 0) {
          repulsiveF = (k * k) / dist;
          n.fr.dx += (xDist / dist) * repulsiveF;
          n.fr.dy += (yDist / dist) * repulsiveF;
        }
      }
    }
  }

  let nSource;
  let nTarget;
  let attractiveF;

  for (i = 0; i < edgesCount; i++) {
    e = edges[i];

    // Attraction force
    nSource = graph.nodeMap[e.source];
    nTarget = graph.nodeMap[e.target];

    if (!nSource || !nTarget) {
      continue;
    }

    xDist = nSource.fr_x - nTarget.fr_x;
    yDist = nSource.fr_y - nTarget.fr_y;

    dist = Math.sqrt(xDist * xDist + yDist * yDist) + 0.0001; // 0.0001 to avoid devide by 0 exceptions
    // dist = Math.sqrt(xDist * xDist + yDist * yDist) - nSource.size - nTarget.size;

    attractiveF = (dist * dist) / k;

    const xDisplacement = (xDist / dist) * attractiveF;
    const yDisplacement = (yDist / dist) * attractiveF;
    nSource.fr.dx -= xDisplacement;
    nSource.fr.dy -= yDisplacement;
    nTarget.fr.dx += xDisplacement;
    nTarget.fr.dy += yDisplacement;
  }

  let d;
  let gf;
  let limitedDist;

  let totalDistance = 0;
  for (i = 0; i < nodesCount; i++) {
    n = nodes[i];

    // Gravity
    d = Math.sqrt(n.fr_x * n.fr_x + n.fr_y * n.fr_y);
    gf = 0.01 * k * gravity * d;
    n.fr.dx -= (gf * n.fr_x) / d;
    n.fr.dy -= (gf * n.fr_y) / d;

    // Speed
    n.fr.dx *= SPEED;
    n.fr.dy *= SPEED;

    // Apply computed displacement
    if (!n.fixed) {
      xDist = n.fr.dx;
      yDist = n.fr.dy;
      dist = Math.sqrt(xDist * xDist + yDist * yDist);
      totalDistance += dist;

      if (dist > 0) {
        limitedDist = Math.min(maxDisplace * SPEED, dist);
        n.fr_x += (xDist / dist) * limitedDist;
        n.fr_y += (yDist / dist) * limitedDist;
      }
    }
  }
  if (totalDistance < 0.001) {
    return true;
  }
}

function applyPositionUpdate(graph, positionsMap) {
  // frequently used aspect ratio on monitors
  const aspectRatio = 16 / 9;

  graph.nodes.forEach(node => {
    let nodeXPos;
    let nodeYPos;

    if (node.fixed) {
      nodeXPos = node.x;
      nodeYPos = node.y;
    } else {
      nodeXPos = node.fr_x * SCALE * aspectRatio;
      nodeYPos = node.fr_y * SCALE;
    }

    node.inNode.x = nodeXPos;
    node.inNode.y = nodeYPos;
    positionsMap.set(node.inNode.id, { x: nodeXPos, y: nodeYPos });
  });
}

function getCameraPositionByDimensions({ minX, maxX, minY, maxY }) {
  return { x: (maxX + minX) / 2, y: (maxY + minY) / 2 };
}

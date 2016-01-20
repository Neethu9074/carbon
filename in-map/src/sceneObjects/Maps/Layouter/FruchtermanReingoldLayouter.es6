/* eslint-disable complexity */
const settings = {
  autoArea: true,
  area: 1,
  gravity: 200,
  speed: 0.1,
  iterations: 1000
};

export default class FruchtermanReingoldLayout {
  constructor() {}

  applyLayout(map) {
    const sigmaGraph = this.buildSigmaGraphStructure(map);
    this.start(sigmaGraph);
    this.applyPositionUpdate(map, sigmaGraph);
  }

  buildSigmaGraphStructure(map) {
    const graph = {
      nodes: [],
      nodeMap: {},
      edges: []
    };

    map.nodes.forEach((node) => {
      const pos = node.getComponent('position').getPosition();
      const sigmaNode = {
        id: node.id,
        x: pos.x + Math.random(),
        y: pos.z + Math.random(),
        size: 1,
        inNode: node
      };
      graph.nodeMap[node.id] = sigmaNode;
      graph.nodes.push(sigmaNode);
    });

    let edgeIdCounter = 0;
    graph.nodes.forEach(source => {
      source.inNode.getOutgoingConnections().forEach(edge => {
        graph.edges.push({
          id: edgeIdCounter++,
          source: edge.from.id,
          target: edge.to.id
        });
      });
    });

    return graph;
  }

  start(graph) {
    // Init nodes
    graph.nodes.forEach(node => {
      node.fr_x = node.x;
      node.fr_y = node.y;
      node.fr = {
        dx: 0,
        dy: 0
      };
    });

    this.go(graph);
  }

  go(graph) {
    for (let i = 0; i < settings.iterations; i++) {
      this.atomicGo(graph);
    }
  }

  atomicGo(graph) {
    const nodes = graph.nodes;
    const edges = graph.edges;
    let i;
    let j;
    let n;
    let n2;
    let e;
    let xDist;
    let yDist;
    let dist;
    let repulsiveF;
    const nodesCount = nodes.length;
    const edgesCount = edges.length;

    // TODO changed
    const area = (nodesCount * nodesCount);

    const maxDisplace = Math.sqrt(area) / 10;
    const k = Math.sqrt(area / (1 + nodesCount));

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
            repulsiveF = k * k / dist;
            n.fr.dx += xDist / dist * repulsiveF;
            n.fr.dy += yDist / dist * repulsiveF;
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

      xDist = nSource.fr_x - nTarget.fr_x;
      yDist = nSource.fr_y - nTarget.fr_y;
      dist = Math.sqrt(xDist * xDist + yDist * yDist) + 0.01;
      // dist = Math.sqrt(xDist * xDist + yDist * yDist) - nSource.size - nTarget.size;
      attractiveF = dist * dist / k;

      if (dist > 0) {
        nSource.fr.dx -= xDist / dist * attractiveF;
        nSource.fr.dy -= yDist / dist * attractiveF;
        nTarget.fr.dx += xDist / dist * attractiveF;
        nTarget.fr.dy += yDist / dist * attractiveF;
      }
    }

    let d;
    let gf;
    let limitedDist;

    for (i = 0; i < nodesCount; i++) {
      n = nodes[i];

      // Gravity
      d = Math.sqrt(n.fr_x * n.fr_x + n.fr_y * n.fr_y);
      gf = 0.01 * k * settings.gravity * d;
      n.fr.dx -= gf * n.fr_x / d;
      n.fr.dy -= gf * n.fr_y / d;

      // Speed
      n.fr.dx *= settings.speed;
      n.fr.dy *= settings.speed;

      // Apply computed displacement
      if (!n.fixed) {
        xDist = n.fr.dx;
        yDist = n.fr.dy;
        dist = Math.sqrt(xDist * xDist + yDist * yDist);

        if (dist > 0) {
          limitedDist = Math.min(maxDisplace * settings.speed, dist);
          n.fr_x += xDist / dist * limitedDist;
          n.fr_y += yDist / dist * limitedDist;
        }
      }
    }
  }

  applyPositionUpdate(map, graph) {
    graph.nodes.forEach(node => {
      if (node.isDisposed) {
        return;
      }

      node.inNode.getComponent('position').setPosition(
        node.fr_x * 2,
        0,
        node.fr_y * 2
      );
    });
  }

}

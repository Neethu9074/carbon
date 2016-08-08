/* eslint-disable complexity */
import {combineLatest} from 'reactive-observables';

import {nodePositions$} from 'in-map/src/stores/process/logicalLayouterStore';
import {edges$} from 'in-map/src/stores/process/edgesStore';
import {nodes$} from 'in-map/src/stores/process/nodesStore';
import {eventBus} from 'in-map/src/services/eventBus';


const SCALE = 5;

export default class Layouter {

  constructor() {
    this.shouldReset = true;
    this.iterations = 1000;
    this.gravity = 500;
    this.speed = 0.1;

    this.layoutingSubscription = combineLatest([nodes$,
                                                edges$,
                                                nodePositions$,
                                                eventBus.on('resetProcessViewLayouting')
                                              ])
                                 .map(([nodes, edges, nodePositions]) => {
                                   return {
                                     nodes: Object.keys(nodes).map(key => nodes[key]),
                                     edges: Object.keys(edges).map(key => edges[key]),
                                     nodePositions
                                   };
                                 })
                                 .debounce(100)
                                 .subscribe(inventar => this.applyLayout(inventar, true));

    this.resetProcessViewLayoutingSubscription = eventBus.on('resetProcessViewLayouting').subscribe(shouldReset => {
      if (shouldReset) {
        this.shouldReset = true;
        eventBus.emit('resetProcessViewLayouting', false);
      }
    });

    eventBus.emit('resetProcessViewLayouting', true);
  }

  applyLayout(inventar) {
    const sigmaGraph = this.buildSigmaGraphStructure(inventar);
    this.start(sigmaGraph);
    this.applyPositionUpdate(sigmaGraph);
  }

  buildSigmaGraphStructure({nodes, edges, nodePositions}) {
    const graph = {
      nodes: [],
      nodeMap: {},
      edges: []
    };

    if (this.shouldReset) {
      nodes.forEach(node => node._wasAutomaticLayouted = false);
      this.shouldReset = false;
    }

    let posOffet = 0;
    nodes.forEach(node => {
      const pos = node.getComponent('position').getPosition();
      const savedPosition = nodePositions.get(node.id);

      const sigmaNode = {
        id: node.id,
        x: pos.x + posOffet++,
        y: pos.z + posOffet++,
        size: 1,
        inNode: node
      };
      graph.nodeMap[node.id] = sigmaNode;
      graph.nodes.push(sigmaNode);

      if (savedPosition) {
        sigmaNode.fixed = true;
        sigmaNode.x = savedPosition.x;
        sigmaNode.y = savedPosition.z;
      } else if (node._wasAutomaticLayouted) {
        sigmaNode.fixed = true;
        sigmaNode.x = pos.x;
        sigmaNode.y = pos.z;
      }
    });

    let edgeIdCounter = 0;
    edges.forEach(edge => {
      graph.edges.push({
        id: edgeIdCounter++,
        source: edge.sourceNode.id,
        target: edge.destinationNode.id
      });
    });

    return graph;
  }

  start(graph) {
    // Init nodes
    graph.nodes.forEach(node => {
      node.fr_x = node.x / SCALE;
      node.fr_y = node.y / SCALE;
      node.fr = {
        dx: 0,
        dy: 0
      };
    });


    this.go(graph);
  }

  go(graph) {
    let i = 0;
    while (i < this.iterations && !this.atomicGo(graph)) {
      i++;
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

    const maxDisplace = nodesCount / 10;
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

    let totalDistance = 0;
    for (i = 0; i < nodesCount; i++) {
      n = nodes[i];

      // Gravity
      d = Math.sqrt(n.fr_x * n.fr_x + n.fr_y * n.fr_y);
      gf = 0.01 * k * this.gravity * d;
      n.fr.dx -= gf * n.fr_x / d;
      n.fr.dy -= gf * n.fr_y / d;

      // Speed
      n.fr.dx *= this.speed;
      n.fr.dy *= this.speed;

      // Apply computed displacement
      if (!n.fixed) {
        xDist = n.fr.dx;
        yDist = n.fr.dy;
        dist = Math.sqrt(xDist * xDist + yDist * yDist);
        totalDistance += dist;

        if (dist > 0) {
          limitedDist = Math.min(maxDisplace * this.speed, dist);
          n.fr_x += xDist / dist * limitedDist;
          n.fr_y += yDist / dist * limitedDist;
        }
      }
    }
    if (totalDistance < 0.001) {
      return true;
    }
  }

  applyPositionUpdate(graph) {
    graph.nodes.forEach(node => {
      node.inNode.getComponent('position').setPosition(node.fr_x * SCALE, 0, node.fr_y * SCALE);
      node.inNode._wasAutomaticLayouted = true;
    });
  }

  dispose() {
    this.resetProcessViewLayoutingSubscription.dispose();
    this.layoutingSubscription.dispose();
  }
}

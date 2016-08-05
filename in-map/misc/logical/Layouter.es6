/* eslint-disable complexity */
import {combineLatest} from 'reactive-observables';

import connections from 'in-map/stores/logical/connectionsStore';
import services from 'in-map/stores/logical/servicesStore';
import {eventBus} from 'in-map/services/eventBus';


const SCALE = 5;

export default function createLayouter(map) {
  const iterations = 1000;
  const gravity = 500;
  const speed = 0.1;

  let firstLayoutDone = false;
  let shouldReset = true;

  const currentDimensions = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };

  const layoutingSubscription = combineLatest([
                                 services.stream,
                                 connections.stream,
                                 eventBus.on('resetProcessViewLayouting')
                               ])
                               .map(([_services, _connections]) => {
                                 return {
                                   _services: Object.keys(_services.objects).map(key => _services.objects[key]),
                                   _connections: Object.keys(_connections.objects).map(key => _connections.objects[key])
                                 };
                               })
                               .debounce(100)
                               .subscribe(inventar => applyLayout(inventar, true));

  const resetProcessViewLayoutingSubscription = eventBus.on('resetProcessViewLayouting').subscribe(_shouldReset => {
    if (_shouldReset) {
      shouldReset = true;
      eventBus.emit('resetProcessViewLayouting', false);
    }
  });
  eventBus.emit('resetProcessViewLayouting', true);

  function applyLayout(inventar) {
    const sigmaGraph = buildSigmaGraphStructure(inventar);
    start(sigmaGraph);
    applyPositionUpdate(sigmaGraph);
  }

  function buildSigmaGraphStructure({_services, _connections}) {
    const graph = {
      nodes: [],
      nodeMap: {},
      edges: []
    };

    if (shouldReset) {
      _services.forEach(node => node._wasAutomaticLayouted = false);
      shouldReset = false;
    }

    let posOffet = 0;
    _services.forEach(node => {
      const pos = node.getComponent('transform').getPosition();

      const sigmaNode = {
        id: node.id,
        x: pos.x + posOffet++,
        y: pos.z + posOffet++,
        size: 1,
        inNode: node
      };
      graph.nodeMap[node.id] = sigmaNode;
      graph.nodes.push(sigmaNode);

      if (node._wasAutomaticLayouted) {
        sigmaNode.fixed = true;
        sigmaNode.x = pos.x;
        sigmaNode.y = pos.z;
      }
    });

    let edgeIdCounter = 0;
    _connections.forEach(edge => {
      graph.edges.push({
        id: edgeIdCounter++,
        source: edge.sourceNode.id,
        target: edge.destinationNode.id
      });
    });

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
    let i = 0;
    while (i < iterations && !atomicGo(graph)) {
      i++;
    }
  }

  function atomicGo(graph) {
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
      gf = 0.01 * k * gravity * d;
      n.fr.dx -= gf * n.fr_x / d;
      n.fr.dy -= gf * n.fr_y / d;

      // Speed
      n.fr.dx *= speed;
      n.fr.dy *= speed;

      // Apply computed displacement
      if (!n.fixed) {
        xDist = n.fr.dx;
        yDist = n.fr.dy;
        dist = Math.sqrt(xDist * xDist + yDist * yDist);
        totalDistance += dist;

        if (dist > 0) {
          limitedDist = Math.min(maxDisplace * speed, dist);
          n.fr_x += xDist / dist * limitedDist;
          n.fr_y += yDist / dist * limitedDist;
        }
      }
    }
    if (totalDistance < 0.001) {
      return true;
    }
  }

  function applyPositionUpdate(graph) {
    currentDimensions.x = 0;
    currentDimensions.y = 0;
    currentDimensions.width = 0;
    currentDimensions.height = 0;

    graph.nodes.forEach(node => {
      const x = node.fr_x * SCALE;
      const y = node.fr_y * SCALE;
      node.inNode.getComponent('transform').setPositionXYZ(x, 0, y);
      node.inNode._wasAutomaticLayouted = true;

      currentDimensions.x = Math.min(currentDimensions.x, x);
      currentDimensions.y = Math.min(currentDimensions.y, y);
      currentDimensions.width = Math.max(currentDimensions.x, x);
      currentDimensions.height = Math.max(currentDimensions.y, y);
    });

    currentDimensions.width -= currentDimensions.x;
    currentDimensions.height -= currentDimensions.y;

    if (!firstLayoutDone) {
      firstLayoutDone = true;
      map.eventEmitter.emit('flyToPosition', getFocusPointFromCurrentDimensions());
    }
  }

  function getFocusPointFromCurrentDimensions() {
    return {
      x: -((currentDimensions.width / 2) - Math.abs(currentDimensions.x)),
      z: (currentDimensions.height / 2) - Math.abs(currentDimensions.y)
    };
  }

  function dispose() {
    layoutingSubscription.dispose();
    resetProcessViewLayoutingSubscription.dispose();
  }

  return {
    getFocusPointFromCurrentDimensions,
    dispose
  };
}

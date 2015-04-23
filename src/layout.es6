'use strict';

import THREE from 'three.js';

export default function applyLayout(map) {
  const structure = buildColaGraphStructure(map);

  const cola = window.cola.d3adaptor()
    .linkDistance(100)
    .avoidOverlaps(true)
    .handleDisconnected(false)
    .size([1000, 1000]);

  cola
    .nodes(structure.graph.nodes)
    .links(structure.graph.links)
    .groups(structure.graph.groups)
    .start();

  cola.on('tick', function() {
    applyPositionUpdate(map, structure);
  });
}


export function buildColaGraphStructure(map) {
  const graph = {
    nodes: [],
    links: [],
    groups: []
  };

  // cola is indexed based, we are ID based. We use this
  // to translate between both worlds
  const zoneToGroupNumberMapping = {};
  const hostToNodeNumberMapping = {};

  let numberOfHosts = 0;
  map.zones.forEach((zone, zoneNumber) => {
    const group = {leaves: []};
    graph.groups.push(group);
    zoneToGroupNumberMapping[zone.id] = zoneNumber;

    zone.hosts.forEach(host => {
      const hostNumber = numberOfHosts++;
      hostToNodeNumberMapping[host.id] = hostNumber;
      graph.nodes[hostNumber] = {
        name: hostNumber + '',
        width: 1,
        height: 1
      };
      group.leaves.push(hostNumber);
    });
  });

  return {
    graph,
    zoneToGroupNumberMapping,
    hostToNodeNumberMapping
  };
}


function applyPositionUpdate(map, structure) {
  map.zones.forEach(zone => {
    zone.hosts.forEach(host => {
      const nodeIndex = structure.hostToNodeNumberMapping[host.id];
      const node = structure.graph.nodes[nodeIndex];
      host.setLocalPosition(new THREE.Vector3(node.x, 0, node.y * -1));
    });
  });
}

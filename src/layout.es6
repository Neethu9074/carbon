'use strict';

export default function applyLayout(map) {
  // const graph = buildColaGraphStructure(map);

  // var cola = cola.d3adaptor()
  //         .linkDistance(100)
  //         .avoidOverlaps(true)
  //         .handleDisconnected(false)
  //         .size([100, 100]);
  //
  // cola
  //             .nodes(graph.nodes)
  //             .links(graph.links)
  //             .groups(graph.groups)
  //             .start();
  //
  //
  // cola.on('tick', function() {
  //   console.log('tick', arguments);
  // });
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

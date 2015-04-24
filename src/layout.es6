'use strict';

import THREE from 'three';

const HOST_SIZE = 1;
const ZONE_PADDING = 1;
const ZONE_MARGIN = 1;
const MAX_HOSTS_PER_ROW = 3;
const HOST_PADDING = 2;

// Each host takes up one unit horizontally.
const ZONE_WIDTH = MAX_HOSTS_PER_ROW +
  // Between the hosts we have some empty space.
  (MAX_HOSTS_PER_ROW - 1) * HOST_PADDING +
  // Before the first and after the last host we have zone padding.
  ZONE_PADDING * 2;

export default function applyLayout(map) {
  map.zones.forEach((zone, zoneIndex) => {
    zone.hosts.forEach((host, hostIndex) => {
      const position = getCubePosition(zoneIndex, hostIndex);
      host.setPosition(position);
    });
  });
}

export function getCubePosition(zoneIndex, hostIndex) {
  // Each zone means that we need to advance one zone horizontally.
  const x = zoneIndex * (ZONE_WIDTH + ZONE_MARGIN) +
      // advance one host- and padding width per host, except the first.
      hostIndex % MAX_HOSTS_PER_ROW * (HOST_PADDING + HOST_SIZE) +
      // There is always the zone padding which we need to take into account.
      ZONE_PADDING;

  // For every host that exceeds the max number of hosts per row we move
  // one unit downwards, where unit means host size + padding
  const y = Math.floor(hostIndex / MAX_HOSTS_PER_ROW) *
      (HOST_SIZE + HOST_PADDING) + ZONE_PADDING;

  return new THREE.Vector3(x, 0, -y);
}

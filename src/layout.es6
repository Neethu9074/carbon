'use strict';

import THREE from 'three';

export default function applyLayout(map) {
  map.zones.forEach((zone, zoneIndex) => {
    zone.hosts.forEach((host, hostIndex) => {
      const [x, y] = getCubePosition(zoneIndex, hostIndex);
      host.setLocalPosition(new THREE.Vector3(
        x,
        0,
        -y
      ));
    });
  });
}

export function getCubePosition(zoneIndex, hostIndex) {
  return [
    zoneIndex * 8 + hostIndex % 3 * 2 + 1,
    Math.floor(hostIndex / 3) * 2 + 1
  ];
}

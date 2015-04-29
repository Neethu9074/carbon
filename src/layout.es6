'use strict';

import THREE from 'three';

import {getPower} from 'instana-ui-sdk/power';

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
    const zonePosition = getZonePosition(zoneIndex, zone.hosts.length);

    // add respectively subtract 0.5 to accomodate for central positioning of
    // hosts.
    zone.setPosition(new THREE.Vector3(
      zonePosition.x + zonePosition.width / 2 - 0.5,
      0,
      (zonePosition.y + zonePosition.height / 2) * -1 + 0.5
    ));
    zone.setScale(new THREE.Vector3(
      zonePosition.width,
      zonePosition.height,
      1
    ));

    zone.hosts.forEach((host, hostIndex) => {
      const position = getCubePosition(zoneIndex, hostIndex);
      host.setPosition(position);
    });
  });

  updateHeight(map);
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

export function getZonePosition(zoneIndex, numberOfHosts) {
  const x = zoneIndex * (ZONE_WIDTH + ZONE_MARGIN);
  const y = 0;
  const width = ZONE_WIDTH;
  const height = getCubePosition(zoneIndex, numberOfHosts - 1).z * -1 +
    HOST_SIZE + ZONE_PADDING;

  return {x, y, width, height};
}

function updateHeight(map) {
  const hosts = map.zones.reduce((agg, zone) => {
    return agg.concat(zone.hosts);
  }, []);

  const maxPower = getMaxPower(hosts);
  hosts.forEach(host => {
    const height = 1 + 2 * (getPower(host.snapshot) / maxPower);
    host.setHeight(height);
  });
}

function getMaxPower(hosts) {
  return hosts.reduce((power, host) => {
    return Math.max(power, getPower(host.snapshot));
  }, 0);
}

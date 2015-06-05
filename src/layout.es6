'use strict';

import THREE from 'three';
import ConnectionGrid from './connectionGrid';

import {getPower} from 'instana-ui-sdk/power';


export default class Layouter {
  constructor({hostSize=1, maxHostHeight=3, zonePadding=1, zoneMargin=1,
      maxHostsPerRow=3, hostPadding=2}={}) {
    this.hostSize = hostSize;
    this.maxHostHeight = maxHostHeight;
    this.zonePadding = zonePadding;
    this.zoneMargin = zoneMargin;
    this.maxHostsPerRow = maxHostsPerRow;
    this.hostPadding = hostPadding;

    this.connections = [];

    // Each host takes up one unit horizontally.
    this.zoneWidth = maxHostsPerRow +
      // Between the hosts we have some empty space.
      (maxHostsPerRow - 1) * hostPadding +
      // Before the first and after the last host we have zone padding.
      zonePadding * 2;
  }

  applyLayout(map) {
    map.zones.forEach((zone, zoneIndex) => {
      const zonePosition = this.getZonePosition(zoneIndex, zone.hosts.length);

      // add respectively subtract 0.5 to accomodate for central positioning of
      // hosts.
      zone.setPosition(
        zonePosition.x + zonePosition.width / 2 - 1,
        0,
        (zonePosition.y + zonePosition.height / 2) * -1 + 1
      );
      zone.setScale(new THREE.Vector3(
        zonePosition.width,
        zonePosition.height,
        1
      ));

      zone.hosts.forEach((host, hostIndex) => {
        const oldPosition = host.getPosition().clone();
        const newPosition = this.getCubePosition(zoneIndex, hostIndex);
        host.setPosition(newPosition.x, newPosition.y, newPosition.z);

        ConnectionGrid.clearPosition(oldPosition);
        ConnectionGrid.blockPosition(newPosition);
      });
    });

    this.updateHeight(map);
  }

  getCubePosition(zoneIndex, hostIndex) {
    // Each zone means that we need to advance one zone horizontally.
    const x = zoneIndex * (this.zoneWidth + this.zoneMargin) +
        // advance one host- and padding width per host, except the first.
        hostIndex % this.maxHostsPerRow * (this.hostPadding + this.hostSize) +
        // There is always the zone padding which we need to take into account.
        this.zonePadding;

    // For every host that exceeds the max number of hosts per row we move
    // one unit downwards, where unit means host size + padding
    const y = Math.floor(hostIndex / this.maxHostsPerRow) *
        (this.hostSize + this.hostPadding) + this.zonePadding;

    return new THREE.Vector3(x, 0, -y);
  }

  getZonePosition(zoneIndex, numberOfHosts) {
    const x = zoneIndex * (this.zoneWidth + this.zoneMargin);
    const y = 0;
    const width = this.zoneWidth;
    const height = this.getCubePosition(zoneIndex, numberOfHosts - 1).z * -1 +
      this.hostSize + this.zonePadding;

    return {x, y, width, height};
  }

  updateHeight(map) {
    const hosts = map.zones.reduce((agg, zone) => {
      return agg.concat(zone.hosts);
    }, []);

    const maxPower = this.getMaxPower(hosts);
    const baseHeight = this.hostSize;
    const growthRange = this.maxHostHeight - this.hostSize;
    hosts.forEach(host => {
      const weightedHeight = growthRange * (host.calculatePower() / maxPower);
      host.setHeight(baseHeight + weightedHeight);
    });
  }

  getMaxPower(hosts) {
    return hosts.reduce((power, host) => {
      return Math.max(power, host.calculatePower());
    }, 0);
  }
}

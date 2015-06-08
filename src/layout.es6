'use strict';

import THREE from 'three';
import ConnectionGrid from './connectionGrid';

import {getPower} from 'instana-ui-sdk/power';


export default class Layouter {
  constructor({hostSize=1, maxHostHeight=3, groupPadding=1, groupMargin=1,
      maxHostsPerRow=3, hostPadding=2}={}) {
    this.hostSize = hostSize;
    this.maxHostHeight = maxHostHeight;
    this.groupPadding = groupPadding;
    this.groupMargin = groupMargin;
    this.maxHostsPerRow = maxHostsPerRow;
    this.hostPadding = hostPadding;

    this.connections = [];

    // Each host takes up one unit horizontally.
    this.groupWidth = maxHostsPerRow +
      // Between the hosts we have some empty space.
      (maxHostsPerRow - 1) * hostPadding +
      // Before the first and after the last host we have group padding.
      groupPadding * 2;
  }

  applyLayout(map) {
    map.groups.forEach((group, groupIndex) => {
      const groupPosition =
        this.getgroupPosition(groupIndex, group.hosts.length);

      // add respectively subtract 0.5 to accomodate for central positioning of
      // hosts.
      group.setPosition(
        groupPosition.x + groupPosition.width / 2 - 1,
        0,
        (groupPosition.y + groupPosition.height / 2) * -1 + 1
      );
      group.setScale(new THREE.Vector3(
        groupPosition.width,
        groupPosition.height,
        1
      ));

      group.hosts.forEach((host, hostIndex) => {
        const oldPosition = host.getPosition().clone();
        const newPosition = this.getCubePosition(groupIndex, hostIndex);
        host.setPosition(newPosition.x, newPosition.y, newPosition.z);

        ConnectionGrid.clearPosition(oldPosition);
        ConnectionGrid.blockPosition(newPosition);
      });
    });

    this.updateHeight(map);
  }

  getCubePosition(groupIndex, hostIndex) {
    // Each group means that we need to advance one group horizontally.
    const x = groupIndex * (this.groupWidth + this.groupMargin) +
        // advance one host- and padding width per host, except the first.
        hostIndex % this.maxHostsPerRow * (this.hostPadding + this.hostSize) +
        // There is always the group padding which we need to take into account.
        this.groupPadding;

    // For every host that exceeds the max number of hosts per row we move
    // one unit downwards, where unit means host size + padding
    const y = Math.floor(hostIndex / this.maxHostsPerRow) *
        (this.hostSize + this.hostPadding) + this.groupPadding;

    return new THREE.Vector3(x, 0, -y);
  }

  getgroupPosition(groupIndex, numberOfHosts) {
    const x = groupIndex * (this.groupWidth + this.groupMargin);
    const y = 0;
    const width = this.groupWidth;
    const height = this.getCubePosition(groupIndex, numberOfHosts - 1).z * -1 +
      this.hostSize + this.groupPadding;

    return {x, y, width, height};
  }

  updateHeight(map) {
    const hosts = map.groups.reduce((agg, group) => {
      return agg.concat(group.hosts);
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

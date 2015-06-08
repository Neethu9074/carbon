'use strict';

import THREE from 'three';
import ConnectionGrid from './connectionGrid';

import {getPower} from 'instana-ui-sdk/power';


export default class Layouter {
  constructor({nodeSize=1, maxNodeHeight=3, groupPadding=1, groupMargin=1,
      maxNodesPerRow=3, nodePadding=2}={}) {
    this.nodeSize = nodeSize;
    this.maxNodeHeight = maxNodeHeight;
    this.groupPadding = groupPadding;
    this.groupMargin = groupMargin;
    this.maxNodesPerRow = maxNodesPerRow;
    this.nodePadding = nodePadding;

    this.connections = [];

    // Each node takes up one unit horizontally.
    this.groupWidth = maxNodesPerRow +
      // Between the nodes we have some empty space.
      (maxNodesPerRow - 1) * nodePadding +
      // Before the first and after the last node we have group padding.
      groupPadding * 2;
  }

  applyLayout(map) {
    map.groups.forEach((group, groupIndex) => {
      const groupPosition =
        this.getgroupPosition(groupIndex, group.nodes.length);

      // add respectively subtract 0.5 to accomodate for central positioning of
      // nodes.
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

      group.nodes.forEach((node, nodeIndex) => {
        const oldPosition = node.getPosition().clone();
        const newPosition = this.getCubePosition(groupIndex, nodeIndex);
        node.setPosition(newPosition.x, newPosition.y, newPosition.z);

        ConnectionGrid.clearPosition(oldPosition);
        ConnectionGrid.blockPosition(newPosition);
      });
    });

    this.updateHeight(map);
  }

  getCubePosition(groupIndex, nodeIndex) {
    // Each group means that we need to advance one group horizontally.
    const x = groupIndex * (this.groupWidth + this.groupMargin) +
        // advance one node- and padding width per node, except the first.
        nodeIndex % this.maxNodesPerRow * (this.nodePadding + this.nodeSize) +
        // There is always the group padding which we need to take into account.
        this.groupPadding;

    // For every node that exceeds the max number of nodes per row we move
    // one unit downwards, where unit means node size + padding
    const y = Math.floor(nodeIndex / this.maxNodesPerRow) *
        (this.nodeSize + this.nodePadding) + this.groupPadding;

    return new THREE.Vector3(x, 0, -y);
  }

  getgroupPosition(groupIndex, numberOfNodes) {
    const x = groupIndex * (this.groupWidth + this.groupMargin);
    const y = 0;
    const width = this.groupWidth;
    const height = this.getCubePosition(groupIndex, numberOfNodes - 1).z * -1 +
      this.nodeSize + this.groupPadding;

    return {x, y, width, height};
  }

  updateHeight(map) {
    const nodes = map.groups.reduce((agg, group) => {
      return agg.concat(group.nodes);
    }, []);

    const maxPower = this.getMaxPower(nodes);
    const baseHeight = this.nodeSize;
    const growthRange = this.maxNodeHeight - this.nodeSize;
    nodes.forEach(node => {
      const weightedHeight = growthRange * (node.calculatePower() / maxPower);
      node.setHeight(baseHeight + weightedHeight);
    });
  }

  getMaxPower(nodes) {
    return nodes.reduce((power, node) => {
      return Math.max(power, node.calculatePower());
    }, 0);
  }
}

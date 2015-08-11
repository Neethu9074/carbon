import THREE from 'three';

import ConnectionGrid from './ConnectionGrid_Temp';
import {getAllNodes} from './mapStructureUtils';


export default class Layouter {

  constructor({
    nodeSize = 1,
    maxNodeHeight = 3,
    groupPadding = 1,
    groupMargin = 1,
    maxNodesPerRow = 3,
    nodePadding = 2} = {}) {

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

  setNodeToPos({node, x=0, y=0, z=0}) {
    const oldPos = node.getComponent('position').getPosition().clone();
    const newPos = {x, y, z};

    node.getComponent('position').setPosition(x, y, z);

    ConnectionGrid.clearPosition(oldPos);
    ConnectionGrid.blockPosition(newPos);
  }

  updateHeight(map) {
    const nodes = getAllNodes(map);
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

  applyLayout(map) {
    map.groups.forEach((group, groupIndex) => {
      const groupPosition =
        this.getGroupPosition(groupIndex, group.children.length);

      // add respectively subtract 0.5 to accomodate for central positioning of
      // nodes.
      group.getComponent('position').setPosition(
        groupPosition.x + groupPosition.width / 2 - 1,
        0,
        (groupPosition.y + groupPosition.height / 2) * -1 + 1
      );
      group.setScale(groupPosition.width, 1, groupPosition.height);

      group.children.forEach((node, nodeIndex) => {
        const oldPosition = node.getComponent('position').getPosition().clone();
        const newPosition = this.getCubePosition(groupIndex, nodeIndex);
        node.getComponent('position').setPosition(newPosition.x, newPosition.y, newPosition.z);

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

  getGroupPosition(groupIndex, numberOfNodes) {
    const x = groupIndex * (this.groupWidth + this.groupMargin);
    const y = 0;
    const width = this.groupWidth;
    const height = this.getCubePosition(groupIndex, numberOfNodes - 1).z * -1 +
      this.nodeSize + this.groupPadding;

    return {x, y, width, height};
  }
}

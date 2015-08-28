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

  setNodeToPos({node, x = 0, y = 0, z = 0}) {
    const posComponent = node.getComponent('position');

    // clear the old position so it can be used in pathfinding again
    const oldPos = posComponent.getPosition();
    ConnectionGrid.clearPosition(oldPos);

    // block the new position so it cannot be used in pathfinding
    posComponent.setPosition(x, y, z);
    ConnectionGrid.blockPosition({x, y, z});
  }

  updateHeight(map, nodes, nodePowerMap) {
    const maxPower = nodes.reduce((power, node) => Math.max(power, nodePowerMap[node.id]), 0);
    const baseHeight = this.nodeSize;
    const growthRange = this.maxNodeHeight - this.nodeSize;
    nodes.forEach(node => {
      const weightedHeight = growthRange * (nodePowerMap[node.id] / maxPower);
      node.setHeight(baseHeight + weightedHeight);
    });
  }

  getMaxPower(nodes) {
    return nodes.reduce((power, node) => {
      return Math.max(power, node.calculatePower());
    }, 0);
  }

  applyLayout(map) {
    const groupIndexMap = {};
    this.layoutGroups(map, groupIndexMap);
    this.layoutNodes(map, groupIndexMap);
  }

  layoutGroups(map, groupIndexMap) {
    // update groups
    map.groups.forEach((group, groupIndex) => {
      const groupPosition = this.getGroupPosition(groupIndex, group.children.length);
      groupIndexMap[group.id] = groupIndex;
      const dim = {
        x: groupPosition.x,
        y: groupPosition.y,
        width: groupPosition.width,
        height: groupPosition.height
      };
      // add respectively subtract 0.5 to accomodate for central positioning of nodes
      group.getComponent('position').setPosition(
        dim.x + dim.width / 2 - 1, 0, (dim.y + dim.height / 2) * -1 + 1);
      group.setScale(dim.width, 1, dim.height);

      group.children.forEach((node, nodeIndex) => {
        const pos = this.getCubePosition(groupIndex, nodeIndex);
        this.setNodeToPos({node, x: pos.x, y: pos.y, z: pos.z});
      });
    });
  }

  layoutNodes(map, groupIndexMap) {
    const allNodes = getAllNodes(this);
    const nodePowerMap = {};
    allNodes.forEach((node, nodeIndex) => {
      const pos = this.getCubePosition(groupIndexMap[node.parent.id], nodeIndex);
      this.setNodeToPos({node, x: pos.x, y: pos.y, z: pos.z});

      nodePowerMap[node.id] = node.calculatePower();
    });
    this.updateHeight(map, allNodes, nodePowerMap);
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
    return {x, y: 0, z: -y};
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

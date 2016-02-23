export default class GroupLayouting {

  constructor({
    nodeSize = 1,
    groupPadding = 1,
    groupMargin = 1,
    maxNodesPerRow = 3,
    nodePadding = 2} = {}) {

    this.nodeSize = nodeSize;
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
    // update groups
    map.groups.forEach((group, groupIndex) => {
      const groupPosition = this.getGroupPosition(groupIndex, group.children.length);
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
        node.getComponent('position').setPosition(pos.x, pos.y, pos.z);
      });
    });
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

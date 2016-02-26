export default class GroupLayouting {

  constructor() {
    this.groupMargin = 1;
    this.nodeMargin = 2;
  }

  applyLayout(map) {
    // the first group starts at (0, 0)
    let groupXCursor = 0;
    map.groups.forEach(group => {
      const numNodesPerRow = Math.floor(Math.sqrt(group.children.length));
      const numNodesPerCol = Math.ceil(group.children.length / numNodesPerRow);
      const dim = {
        x: groupXCursor,
        width: 2 + numNodesPerRow + (numNodesPerRow - 1) * 2,
        height: 2 + numNodesPerCol + (numNodesPerCol - 1) * 2
      };

      group.getComponent('position').setPosition(dim.x + dim.width / 2 - 1, 0,
                                                (dim.height / 2) * -1 + 1);
      group.setScale(dim.width, 1, dim.height);

      let nodeXCursor = groupXCursor + 1;
      let nodeYCursor = 1;
      group.children.forEach(node => {
        node.getComponent('position').setPosition(nodeXCursor, 0, -nodeYCursor);

        nodeXCursor += this.nodeMargin + 1;
        if (nodeXCursor >= dim.x + dim.width) {
          nodeXCursor = groupXCursor + 1;
          nodeYCursor += this.nodeMargin + 1;
        }
      });

      groupXCursor += dim.width + this.groupMargin;
    });
  }
}

export default class GroupLayouting {

  constructor() {
    this.groupMargin = 1;
    this.nodeMargin = 2;
    this.squashFactor = 0.5;
  }

  applyLayout(map) {
    // the first group starts at (0, 0)
    let groupXCursor = 0;
    map.groups
      .sort((a, b) => {
        if (a.id === 'undefined-zone') {
          return Number.maxValue;
        }
        if (b.id === 'undefined-zone') {
          return -1 * Number.maxValue;
        }
        return a._cachedLabel.localeCompare(b._cachedLabel);
      })
      .forEach(group => {
        const numNodesPerRow = Math.ceil(this.squashFactor * Math.sqrt(group.children.length));
        const numNodesPerCol = Math.ceil(group.children.length / numNodesPerRow);
        const dim = {
          x: groupXCursor,
          width: this.nodeMargin + numNodesPerRow + (numNodesPerRow - 1) * this.nodeMargin,
          height: this.nodeMargin + numNodesPerCol + (numNodesPerCol - 1) * this.nodeMargin
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

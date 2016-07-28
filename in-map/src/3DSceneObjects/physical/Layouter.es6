const MAX_VALUE = Number.MAX_VALUE;
const idOfUnmonitoredZone = 'unmonitored-hosts-zone';

export default class GroupLayouting {

  constructor() {
    this.firstLayoutDone = false;
    this.squashFactor = 0.5;
    this.groupMargin = 1;
    this.nodeMargin = 2;

    this.currentDimensions = {
      x: 0,
      y: 0
    };
  }

  applyLayout(map) {
    this.currentDimensions.x = 0;
    this.currentDimensions.y = 0;

    // the first group starts at (0, 0)
    let groupXCursor = 0;
    this.sortGroups(map.groups).forEach(group => {
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

      this.sortNodes(group.children).forEach(node => {
        this.currentDimensions.x = Math.max(this.currentDimensions.x, nodeXCursor);
        this.currentDimensions.y = Math.max(this.currentDimensions.y, nodeYCursor);
        node.getComponent('position').setPosition(nodeXCursor, 0, -nodeYCursor);

        nodeXCursor += this.nodeMargin + 1;
        if (nodeXCursor >= dim.x + dim.width) {
          nodeXCursor = groupXCursor + 1;
          nodeYCursor += this.nodeMargin + 1;
        }
      });

      groupXCursor += dim.width + this.groupMargin;
    });

    if (!this.firstLayoutDone) {
      this.firstLayoutDone = true;
      map.centerMap();
    }
  }

  sortGroups(groups) {
    // doerte sort -> unmonitored zone is the last one
    groups.sort((a, b) => {
      if (a.id === idOfUnmonitoredZone) {
        return MAX_VALUE;
      }
      if (b.id === idOfUnmonitoredZone) {
        return -1 * MAX_VALUE;
      }
      return a._cachedLabel.localeCompare(b._cachedLabel);
    });

    return groups;
  }

  sortNodes(nodes) {
    nodes.sort((a, b) => a._cachedLabel.localeCompare(b._cachedLabel));

    return nodes;
  }
}

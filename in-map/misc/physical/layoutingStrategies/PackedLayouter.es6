import Packer from 'in-map/misc/physical/Packer';


let groupMarginWidth;
let groupMarginHeight;
const groupPadding = 1;
const nodeMargin = 2;

export default function applyLayout({groups, packingXSpace = 1, packingYSpace = 1}) {
  groupMarginWidth = packingXSpace;
  groupMarginHeight = packingYSpace;

  const dimensions = calculateDimensions(groups);
  groups.forEach(group => setGroupPosition(
    group,
    dimensions[group.id],
    -dimensions.width / 2,
    dimensions.height / 4
  ));
}

function calculateDimensions(_groups) {
  const dimensions = {
    width: 0,
    height: 0
  };

  // width and height of each group
  _groups.forEach(group => {
    const nodesCount = Object.keys(group.nodes.objects).length;
    const numNodesPerRow = Math.floor(Math.sqrt(nodesCount));
    const numNodesPerCol = Math.ceil(nodesCount / numNodesPerRow);
    const dim = {
      width: nodeMargin + numNodesPerRow + (numNodesPerRow - 1) * nodeMargin,
      height: nodeMargin + numNodesPerCol + (numNodesPerCol - 1) * nodeMargin
    };

    dimensions[group.id] = dim;
  });

  var blocks = [];
  _groups.forEach(group => {
    const dim = dimensions[group.id];
    const block = {
      id: group.id,
      w: dim.width + groupMarginWidth,
      h: dim.height + groupMarginHeight
    };
    blocks.push(block);
  });

  var packer = new Packer();
  blocks.sort((a, b) => b.h - a.h); // sort inputs for best results
  packer.fit(blocks);

  const positions = {};
  blocks.forEach(block => positions[block.id] = block.fit);

  _groups.forEach(group => {
    const dimension = dimensions[group.id];
    const block = positions[group.id];

    dimension.x = block.x;
    dimension.y = block.y;
  });

  // final width and height of all layouted groups
  _groups.forEach(group => {
    const dimension = dimensions[group.id];
    dimensions.width = Math.max(dimensions.width, dimension.x + dimension.width);
    dimensions.height = Math.max(dimensions.height, dimension.height);
  });

  return dimensions;
}

function setGroupPosition(group, dimension, xOffset, yOffset) {
  const transform = group.getComponent('transform');
  transform.setPositionXYZ(xOffset + dimension.width / 2 + dimension.x,
                           0,
                           yOffset - dimension.height / 2 - dimension.y);
  transform.setScaleXYZ(dimension.width,
                        1,
                        dimension.height);

  const _nodes = Object.keys(group.nodes.objects).map(key => group.nodes.objects[key]);
  setNodesPositions(_nodes, dimension, xOffset, yOffset);
}

function setNodesPositions(_nodes, groupDimension, xOffset, yOffset) {
  let nodeXCursor = groupDimension.x + groupPadding;
  let nodeYCursor = groupDimension.y + groupPadding;

  sortNodes(_nodes).forEach(node => {
    node.getComponent('transform').setPositionXYZ(xOffset + nodeXCursor + 0.5,
                                                  0,
                                                  yOffset - nodeYCursor + 0.5 - groupPadding);

    nodeXCursor += nodeMargin + 1;
    if (nodeXCursor >= groupDimension.x + groupDimension.width) {
      nodeXCursor = groupDimension.x + 1;
      nodeYCursor += nodeMargin + 1;
    }
  });
}

function sortNodes(_nodes) {
  _nodes.sort((a, b) => a._cachedLabel.localeCompare(b._cachedLabel));
  return _nodes;
}

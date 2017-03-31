import { ID_OF_UNMONITORED_ZONE } from 'in-services/unmonitoredZone';

const MAX_VALUE = Number.MAX_VALUE;
const squashFactor = 0.5;
const groupMargin = 1;
const nodeMargin = 2;

export default function applyLayout({ groups }) {
  // the first group starts at (0, 0)
  let groupXCursor = 0;
  let width = 0;
  let height = 0;
  const groupDimensions = {};
  const sortedGroups = sortGroups(groups);

  sortedGroups.forEach(group => {
    const _nodes = Object.keys(group.nodes.objects).map(key => group.nodes.objects[key]);
    const numNodesPerRow = Math.ceil(squashFactor * Math.sqrt(_nodes.length));
    const numNodesPerCol = Math.ceil(_nodes.length / numNodesPerRow);
    const dim = {
      x: groupXCursor,
      width: nodeMargin + numNodesPerRow + (numNodesPerRow - 1) * nodeMargin,
      height: nodeMargin + numNodesPerCol + (numNodesPerCol - 1) * nodeMargin
    };

    groupDimensions[group.id] = dim;

    groupXCursor += dim.width + groupMargin;
    width = Math.max(width, dim.x + dim.width);
    height = Math.max(height, dim.height);
  });

  const xOffset = -width / 2;
  const yOffset = height / 4;

  sortedGroups.forEach(group => {
    const _nodes = Object.keys(group.nodes.objects).map(key => group.nodes.objects[key]);
    const dim = groupDimensions[group.id];

    const transform = group.getComponent('transform');
    transform.setPositionXYZ(xOffset + dim.x + dim.width / 2, 0, yOffset - dim.height / 2);
    transform.setScaleXYZ(dim.width, 1, dim.height);

    let nodeXCursor = dim.x + 1;
    let nodeYCursor = 1;

    sortNodes(_nodes).forEach(node => {
      node
        .getComponent('transform')
        .setPositionXYZ(xOffset + nodeXCursor + 0.5, 0, yOffset - nodeYCursor + 0.5 - groupMargin);

      nodeXCursor += nodeMargin + 1;
      if (nodeXCursor >= dim.x + dim.width) {
        nodeXCursor = dim.x + 1;
        nodeYCursor += nodeMargin + 1;
      }
    });
  });
}

function sortGroups(_groups) {
  // doerte sort -> unmonitored zone is the last one
  _groups.sort((a, b) => {
    if (a.id === ID_OF_UNMONITORED_ZONE) {
      return MAX_VALUE;
    }
    if (b.id === ID_OF_UNMONITORED_ZONE) {
      return -1 * MAX_VALUE;
    }
    return a._cachedLabel.localeCompare(b._cachedLabel);
  });

  return _groups;
}

function sortNodes(_nodes) {
  _nodes.sort((a, b) => a._cachedLabel.localeCompare(b._cachedLabel));
  return _nodes;
}

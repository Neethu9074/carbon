/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { sortGroups, sortNodes } from 'in-map/misc/physical/layoutingStrategies/util.ts';

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
    const numNodesPerRow = Math.ceil(squashFactor * Math.sqrt(group.nodes.size));
    const numNodesPerCol = Math.ceil(group.nodes.size / numNodesPerRow);
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
    const _nodes = [];
    group.nodes.forEach(node => _nodes.push(node));

    const dim = groupDimensions[group.id];

    const transform = group.getComponent('transform');
    transform.setTransformXYZ(xOffset + dim.x + dim.width / 2, 0, yOffset - dim.height / 2, dim.width, 1, dim.height);

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

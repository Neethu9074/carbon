/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { DISTANCE_BETWEEN_NODES_X, DISTANCE_BETWEEN_NODES_Y } from 'in-applications/FlowMap/misc/layouting/config';
import RemainingNodesPlaceholderClass from 'in-applications/FlowMap/sceneObjects/RemainingNodesPlaceholder';

export default function layout(rootNode) {
  rootNode.setPosition(0, 0);

  layoutNodesRecursively(rootNode.incoming, 'incoming', -DISTANCE_BETWEEN_NODES_X, -DISTANCE_BETWEEN_NODES_X);
  layoutNodesRecursively(rootNode.outgoing, 'outgoing', DISTANCE_BETWEEN_NODES_X, DISTANCE_BETWEEN_NODES_X);

  function layoutNodesRecursively(nodes, direction, xPosition, step) {
    if (nodes.length > 0) {
      nodes = nodes.slice().sort(n1 => (n1 instanceof RemainingNodesPlaceholderClass ? 1 : -1));
    }

    const nextIncomingNodes = layoutColumn(nodes, xPosition, direction);
    if (nodesAvailable(nextIncomingNodes)) {
      layoutNodesRecursively(nextIncomingNodes, direction, xPosition + step, step);
    }
  }

  function nodesAvailable(nodes) {
    return nodes && nodes.length > 0;
  }

  function layoutColumn(nodes, xPosition, direction) {
    const totalColumnHeight = getTotalColumnHeight(nodes);

    let nextColumnNodes = [];
    let previousYPosition = 0;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const yPosition = previousYPosition;

      node.setPosition(xPosition, yPosition + totalColumnHeight / 2);
      previousYPosition -= node.__height || 0;

      if (node[direction]) {
        nextColumnNodes = nextColumnNodes.concat(node[direction]);
      }
    }
    return nextColumnNodes;
  }

  function getTotalColumnHeight(nodes) {
    let totalColumnHeight = 0;
    if (nodes.length <= 1) {
      return totalColumnHeight;
    }

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (node.children.size > 0) {
        node.__height = node.children.size * 2;
        node.__height += 1;
      } else {
        node.__height = DISTANCE_BETWEEN_NODES_Y;
      }

      if (i < nodes.length - 1) {
        totalColumnHeight += node.__height;
      }
    }
    return totalColumnHeight;
  }
}

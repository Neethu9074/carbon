import { DISTANCE_BETWEEN_NODES_X, DISTANCE_BETWEEN_NODES_Y } from 'in-components/FlowMap/misc/layouting/config';

export default function layout(rootNode, nodesMap) {
  setStartingNodeToCenter(rootNode);

  layoutNodesRecursively(rootNode.incoming, 'incoming', -DISTANCE_BETWEEN_NODES_X, -DISTANCE_BETWEEN_NODES_X);
  layoutNodesRecursively(rootNode.outgoing, 'outgoing', DISTANCE_BETWEEN_NODES_X, DISTANCE_BETWEEN_NODES_X);

  function setStartingNodeToCenter(rootNode) {
    const startingNodeSceneObject = nodesMap.get(rootNode.id);
    startingNodeSceneObject.setPosition(0, 0);
  }

  function layoutNodesRecursively(nodes, direction, xPosition, step) {
    const nextIncomingNodes = layoutColumn(nodes, xPosition, direction);
    if (nodesAvailable(nextIncomingNodes)) {
      layoutNodesRecursively(nextIncomingNodes, direction, xPosition + step, step);
    }
  }

  function nodesAvailable(nodes) {
    return nodes && nodes.length > 0;
  }

  function layoutColumn(nodes, xPosition, direction) {
    nodes = nodes.map(id => nodesMap.get(id));
    const totalColumnHeight = getTotalColumnHeight(nodes);

    let nextColumnNodes = [];
    let previousYPosition = 0;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const nodeId = node.id;
      const yPosition = previousYPosition;

      nodesMap.get(nodeId).setPosition(xPosition, yPosition + totalColumnHeight / 2);
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
      node.__height = DISTANCE_BETWEEN_NODES_Y + node.children.size * (0.018982536066818528 * 21);

      if (i < nodes.length - 1) {
        totalColumnHeight += node.__height;
      }
    }
    return totalColumnHeight;
  }
}

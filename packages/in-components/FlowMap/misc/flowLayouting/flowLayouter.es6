export const DISTANCE_BETWEEN_NODES_X = 6;
export const DISTANCE_BETWEEN_NODES_Y = 3;

export default function layout(rootNode, nodesMap) {
  setStartingNodeToCenter(rootNode);

  layoutNodesRecursively(rootNode.incoming, 'incoming', -DISTANCE_BETWEEN_NODES_X);
  layoutNodesRecursively(rootNode.outgoing, 'outgoing', DISTANCE_BETWEEN_NODES_X);

  function setStartingNodeToCenter(rootNode) {
    const startingNodeSceneObject = nodesMap.get(rootNode.id);
    startingNodeSceneObject.setPosition(0, 0);
  }

  function layoutNodesRecursively(nodes, direction, xPosition) {
    const nextIncomingNodes = layoutColumn(nodes, xPosition, direction);
    if (nodesAvailable(nextIncomingNodes)) {
      layoutNodesRecursively(nextIncomingNodes, direction, xPosition + xPosition);
    }
  }

  function nodesAvailable(nodes) {
    return nodes && nodes.length > 0;
  }

  function layoutColumn(nodes, xPosition, direction) {
    let nextColumnNodes = [];
    for (let i = 0; i < nodes.length; i++) {
      const nodeId = nodes[i];
      nodesMap.get(nodeId).setPosition(xPosition, getNodesYPosition(i, nodes.length));

      const node = nodesMap.get(nodeId);
      if (node[direction]) {
        nextColumnNodes = nextColumnNodes.concat(node[direction]);
      }
    }
    return nextColumnNodes;
  }

  function getNodesYPosition(index, numTotalNodesInThisColumn) {
    return -index * DISTANCE_BETWEEN_NODES_Y + DISTANCE_BETWEEN_NODES_Y * (numTotalNodesInThisColumn - 1) / 2;
  }
}

export const DISTANCE_BETWEEN_NODES_X = 6;
export const DISTANCE_BETWEEN_NODES_Y = 3;

export default function layout(startingNodeObject, nodesMap, connectionsMap) {
  setStartingNodeToCenter(startingNodeObject);

  layoutNodesRecursively(startingNodeObject.incoming, 'incoming', -DISTANCE_BETWEEN_NODES_X);
  layoutNodesRecursively(startingNodeObject.outgoing, 'outgoing', DISTANCE_BETWEEN_NODES_X);
  layoutConnections();

  function setStartingNodeToCenter(startingNode) {
    const startingNodeSceneObject = nodesMap.get(startingNode.id);
    startingNodeSceneObject.setPosition(0, 0);
  }

  function layoutNodesRecursively(nodes, direction, xPosition = 0) {
    const nextIncomingNodes = layoutColumn(nodes, xPosition, direction);
    if (nextIncomingNodes) {
      layoutNodesRecursively(nextIncomingNodes, direction, xPosition + xPosition);
    }
  }

  function layoutColumn(nodes, xPosition, direction) {
    if (nodesAvailable(nodes)) {
      let nextColumnNodes = [];
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        nodesMap.get(node.id).setPosition(xPosition, getNodesYPosition(i, nodes.length));

        if (node[direction]) {
          nextColumnNodes = nextColumnNodes.concat(node[direction]);
        }
      }
      return nextColumnNodes;
    }
  }

  function nodesAvailable(nodes) {
    return nodes && nodes.length > 0;
  }

  function layoutConnections() {
    const connections = connectionsMap.values();
    for (const connection of connections) {
      connection.setFromAndToPositions(
        nodesMap.get(connection.from.id).getPosition(),
        nodesMap.get(connection.to.id).getPosition()
      );
    }
  }
}

function getNodesYPosition(index, numTotalNodesInThisColumn) {
  return -index * DISTANCE_BETWEEN_NODES_Y + DISTANCE_BETWEEN_NODES_Y * (numTotalNodesInThisColumn - 1) / 2;
}

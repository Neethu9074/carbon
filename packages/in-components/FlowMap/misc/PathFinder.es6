import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';

export default class PathFinder {
  constructor(serviceLocatorUid, rootNodeId) {
    this.serviceLocatorUid = serviceLocatorUid;
    this.rootNodeId = rootNodeId;
  }

  find(id, direction) {
    if (!this.rootNodeId) {
      return [id];
    }

    const currentNodes = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator.getNodes();
    if (!currentNodes.has(id)) {
      return [id];
    }

    const rootNode = currentNodes.get(this.rootNodeId);

    return direction === 'incoming'
      ? this.searchLeft(currentNodes, rootNode, id)
      : this.searchRight(currentNodes, rootNode, id);
  }

  searchLeft(currentNodes, node, idToFind) {
    if (idToFind === node.id) {
      return [idToFind];
    }

    for (let i = 0; i < node.incoming.length; i++) {
      const outgoingNode = currentNodes.get(node.incoming[i]);
      const match = this.searchLeft(currentNodes, outgoingNode, idToFind);
      if (match) {
        return match.concat(node.id);
      }
    }
  }

  searchRight(currentNodes, node, idToFind) {
    if (idToFind === node.id) {
      return [idToFind];
    }

    for (let i = 0; i < node.outgoing.length; i++) {
      const outgoingNode = currentNodes.get(node.outgoing[i]);
      const match = this.searchRight(currentNodes, outgoingNode, idToFind);
      if (match) {
        return [node.id].concat(match);
      }
    }
  }
}

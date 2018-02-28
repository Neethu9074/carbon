import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';

export default class PathFinder {
  constructor(serviceLocatorUid) {
    this.serviceLocatorUid = serviceLocatorUid;
  }

  setRootNodeId(id) {
    this.rootNodeId = id;
  }

  find(nodeId, childId, direction) {
    if (!this.rootNodeId) {
      return [childId];
    }

    const currentNodes = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator.getNodes();
    if (!currentNodes.has(nodeId)) {
      return [childId];
    }

    const rootChild = currentNodes
      .get(this.rootNodeId)
      .children.values()
      .next().value;

    return direction === 'incoming'
      ? this.searchLeft(currentNodes, rootChild, childId)
      : this.searchRight(currentNodes, rootChild, childId);
  }

  searchLeft(currentNodes, child, idToFind) {
    if (idToFind === child.id) {
      return [idToFind];
    }

    for (let i = 0; i < child.incoming.length; i++) {
      let incomingChild = child.incoming[i];
      const childsNode = currentNodes.get(incomingChild.nodeId);
      incomingChild = childsNode.children.get(incomingChild.id);

      const match = this.searchLeft(currentNodes, incomingChild, idToFind);
      if (match) {
        return match.concat(child.id);
      }
    }
  }

  searchRight(currentNodes, child, idToFind) {
    if (idToFind === child.id) {
      return [idToFind];
    }

    for (let i = 0; i < child.outgoing.length; i++) {
      let outgoingChild = child.outgoing[i];
      const childsNode = currentNodes.get(outgoingChild.nodeId);
      outgoingChild = childsNode.children.get(outgoingChild.id);

      const match = this.searchRight(currentNodes, outgoingChild, idToFind);
      if (match) {
        return [child.id].concat(match);
      }
    }
  }
}

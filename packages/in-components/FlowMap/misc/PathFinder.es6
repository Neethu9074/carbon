import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';

export default class PathFinder {
  constructor(serviceLocatorUid) {
    this.serviceLocatorUid = serviceLocatorUid;
  }

  setRootNodeId(id) {
    this.rootNodeId = id;
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
    return direction === 'incoming' ? this.searchLeft(rootNode, id) : this.searchRight(rootNode, id);
  }

  findChild(nodeId, childId, direction) {
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

    return direction === 'incoming' ? this.searchLeft(rootChild, childId) : this.searchRight(rootChild, childId);
  }

  searchLeft(item, idToFind) {
    if (idToFind === item.id) {
      return [idToFind];
    }

    for (let i = 0; i < item.incoming.length; i++) {
      const match = this.searchLeft(item.incoming[i], idToFind);
      if (match) {
        return match.concat(item.id);
      }
    }
  }

  searchRight(item, idToFind) {
    if (idToFind === item.id) {
      return [idToFind];
    }

    for (let i = 0; i < item.outgoing.length; i++) {
      const match = this.searchRight(item.outgoing[i], idToFind);
      if (match) {
        return [item.id].concat(match);
      }
    }
  }
}

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
    return (direction === 'incoming' ? this.searchLeft(rootNode, id) : this.searchRight(rootNode, id)).map(
      item => item.id
    );
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

    return (direction === 'incoming' ? this.searchLeft(rootChild, childId) : this.searchRight(rootChild, childId)).map(
      item => {
        return {
          service: item.parentNode.id,
          endpoint: item.id
        };
      }
    );
  }

  searchLeft(item, idToFind) {
    if (idToFind === item.id) {
      return [item];
    }

    for (let i = 0; i < item.incoming.length; i++) {
      const match = this.searchLeft(item.incoming[i], idToFind);
      if (match) {
        return match.concat(item);
      }
    }
  }

  searchRight(item, idToFind) {
    if (idToFind === item.id) {
      return [item];
    }

    for (let i = 0; i < item.outgoing.length; i++) {
      const match = this.searchRight(item.outgoing[i], idToFind);
      if (match) {
        return [item].concat(match);
      }
    }
  }
}

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export default class PathFinder {
  constructor(nodes) {
    this.nodes = nodes;
  }

  setRootNodeId(id) {
    this.rootNodeId = id;
  }

  find(id, direction) {
    if (!this.nodes.has(id)) {
      return [{ id }];
    }

    if (!this.rootNodeId) {
      return [this.nodes.get(id)];
    }

    const rootNode = this.nodes.get(this.rootNodeId);
    return direction === 'incoming' ? this.searchLeft(rootNode, id) : this.searchRight(rootNode, id);
  }

  findChild(nodeId, childId, direction) {
    if (!this.nodes.has(nodeId)) {
      return [{ service: nodeId, endpoint: childId }];
    }

    if (!this.rootNodeId) {
      return [this.nodes.get(nodeId)];
    }

    const node = this.nodes.get(nodeId);

    const rootChild = this.nodes
      .get(this.rootNodeId)
      .children.values()
      .next().value;

    return (direction === 'incoming'
      ? this.searchLeft(rootChild, childId, node.id)
      : this.searchRight(rootChild, childId, node.id)
    ).map(item => {
      return {
        service: this.nodes.get(item.nodeId).__originalId,
        endpoint: item.id
      };
    });
  }

  searchLeft(item, childIdToFind, parentIdToFind) {
    if (this.matchesItem(item, childIdToFind, parentIdToFind)) {
      return [item];
    }

    for (let i = 0; i < item.incoming.length; i++) {
      const match = this.searchLeft(item.incoming[i], childIdToFind, parentIdToFind);
      if (match) {
        return match.concat(item);
      }
    }
  }

  searchRight(item, childIdToFind, parentIdToFind) {
    if (this.matchesItem(item, childIdToFind, parentIdToFind)) {
      return [item];
    }

    for (let i = 0; i < item.outgoing.length; i++) {
      const match = this.searchRight(item.outgoing[i], childIdToFind, parentIdToFind);
      if (match) {
        return [item].concat(match);
      }
    }
  }
  matchesItem(item, childIdToFind, parentIdToFind) {
    if (childIdToFind === item.id) {
      if (!parentIdToFind || parentIdToFind === item.nodeId) {
        return true;
      }
    }
    return false;
  }
}

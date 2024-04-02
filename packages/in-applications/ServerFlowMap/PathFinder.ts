/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { NodeCollection } from './types';

export default class PathFinder {
  rootNodeId: string | undefined;
  nodes: any;
  constructor(nodes: NodeCollection) {
    this.nodes = nodes;
  }

  setRootNodeId(id: string) {
    this.rootNodeId = id;
  }

  find(id: string, direction: string) {
    if (!this.nodes.has(id)) {
      return [{ id }];
    }

    if (!this.rootNodeId) {
      return [this.nodes.get(id)];
    }

    const rootNode = this.nodes.get(this.rootNodeId);
    return direction === 'incoming' ? this.searchLeft(rootNode, id) : this.searchRight(rootNode, id, undefined);
  }

  findChild(nodeId: string, childId: string, direction: string) {
    if (!this.nodes.has(nodeId)) {
      return [{ service: nodeId, endpoint: childId }];
    }

    if (!this.rootNodeId) {
      return [this.nodes.get(nodeId)];
    }

    const node = this.nodes.get(nodeId);

    const rootChild = this.nodes.get(this.rootNodeId).children.values().next().value;
    return (
      direction === 'incoming'
        ? this.searchLeft(rootChild, childId, node.id)
        : this.searchRight(rootChild, childId, node.id)
    ).map((item: any) => {
      return {
        service: this.nodes.get(item.nodeId).__originalId,
        endpoint: item.id
      };
    });
  }

  searchLeft(item: any, childIdToFind: string, parentIdToFind?: undefined): any {
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

  searchRight(item: any, childIdToFind: string, parentIdToFind?: string): any {
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
  matchesItem(item: any, childIdToFind: string, parentIdToFind?: string) {
    if (childIdToFind === item.id) {
      if (!parentIdToFind || parentIdToFind === item.nodeId) {
        return true;
      }
    }
    return false;
  }
}

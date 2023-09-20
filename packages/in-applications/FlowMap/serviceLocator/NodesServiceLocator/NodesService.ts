/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  Node,
  NodesCollection,
  ServiceNullService
} from 'in-applications/FlowMap/serviceLocator/NodesServiceLocator/types';
import createCollection from 'in-map/stores/ObjectCollectionStream';

export default function createNodesService(): ServiceNullService {
  const nodes: NodesCollection<Node> = createCollection();
  function addNode(id: string, object: Node) {
    nodes.add(id, object);
  }

  function removeNode(id: string) {
    nodes.remove(id);
  }

  function getNodes(): NodesCollection<Node> {
    return nodes;
  }

  function getNode(id: string): Node | undefined {
    return nodes.objects.get(id);
  }

  function dispose() {
    nodes.clear();
  }

  return {
    addNode,
    removeNode,
    getNodes,
    getNode,
    dispose
  };
}

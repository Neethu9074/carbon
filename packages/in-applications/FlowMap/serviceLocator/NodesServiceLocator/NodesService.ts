/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// @ts-expect-error will migrate in future commit
import createCollection from 'in-map/stores/ObjectCollectionStream';
import { Node, NodesCollection } from 'in-applications/FlowMap/serviceLocator/NodesServiceLocator/types';

export default function createNodesService() {
  const nodes = createCollection();
  function addNode(id: string, object: Node) {
    nodes.add(id, object);
  }

  function removeNode(id: string) {
    nodes.remove(id);
  }

  function getNodes(): NodesCollection {
    return nodes;
  }

  function getNode(id: string): Node {
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

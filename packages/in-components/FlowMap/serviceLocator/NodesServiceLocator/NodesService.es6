import createCollection from 'in-map/stores/ObjectCollectionStream';

export default function createNodesService() {
  const nodes = createCollection();

  function addNode(id, object) {
    nodes.add(id, object);
  }

  function removeNode(id) {
    nodes.remove(id);
  }

  function getNodes() {
    return nodes;
  }

  function dispose() {}

  return {
    addNode,
    removeNode,
    getNodes,
    dispose
  };
}

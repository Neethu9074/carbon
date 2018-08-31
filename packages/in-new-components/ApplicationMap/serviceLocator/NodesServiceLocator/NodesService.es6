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

  function getNode(id) {
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

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

  function dispose() {
    nodes.clear();
  }

  function findConnected(id) {
    function find(direction) {
      const nodesIterator = nodes.objects.values();
      for (const otherNode of nodesIterator) {
        for (let iConnected = 0; iConnected < otherNode[direction].length; iConnected++) {
          const connectedNode = otherNode[direction][iConnected];
          if (connectedNode.id === id) {
            return { node: otherNode, index: iConnected, direction };
          }
        }
      }
    }

    return find('incoming') || find('outgoing');
  }

  return {
    addNode,
    removeNode,
    getNodes,
    findConnected,
    dispose
  };
}

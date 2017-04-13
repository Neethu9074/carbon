import { emptyArray } from 'in-services/fixedObjects';
import Node from 'in-map/SceneGraph/Node';

export default class ConnectionHandlerNode extends Node {
  constructor(params) {
    super({ params });

    this.connectionNodeType = params.connectionNodeType;
  }

  createConnections(entity, entities) {
    const hostId = entity.id;
    const outgoing = entity.outgoingConnections || emptyArray;
    const incoming = entity.incomingConnections || emptyArray;
    const NodeType = this.connectionNodeType;
    const connections = [];

    let connectionIndex = 0;
    function addConnection(entity, sourceNode, destinationNode) {
      if (sourceNode && destinationNode) {
        connections[connectionIndex++] = {
          NodeType,
          params: {
            id: entity.id,
            entity,
            bidirectional: entity.bidirectional || false,
            sourceNode: sourceNode.sceneObjectInstance || sourceNode,
            destinationNode: destinationNode.sceneObjectInstance || destinationNode
          }
        };
      }
    }

    for (let i = 0, length = outgoing.length; i < length; i++) {
      const entity = outgoing[i];
      addConnection(entity, entities[hostId], entities[entity.otherId]);
    }
    for (let i = 0, length = incoming.length; i < length; i++) {
      const entity = incoming[i];
      addConnection(entity, entities[entity.otherId], entities[hostId]);
    }

    for (let i = 0, length = connections.length; i < length; i++) {
      this.updateEntities(connections);
    }
  }

  clearConnections() {
    this.updateEntities(emptyArray);
  }

  dispose() {
    this.clearConnections();

    super.dispose();
  }
}

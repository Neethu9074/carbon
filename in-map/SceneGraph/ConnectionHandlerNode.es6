import Node from 'in-map/SceneGraph/Node';


export default class ConnectionHandlerNode extends Node {

  constructor(params) {
    super({params});

    this.connectionNodeType = params.connectionNodeType;
  }

  createConnections(entity, entities) {
    const hostId = entity.id;
    const outgoing = entity.outgoingConnections || [];
    const incoming = entity.incomingConnections || [];
    const connections = [];

    outgoing.forEach(entity => {
      const sourceNode = entities[hostId];
      const destinationNode = entities[entity.otherId];

      if (sourceNode && destinationNode) {
        connections.push({
          sourceNode: sourceNode.sceneObjectInstance || sourceNode,
          destinationNode: destinationNode.sceneObjectInstance || destinationNode,
          entity
        });
      }
    });

    incoming.forEach(entity => {
      const sourceNode = entities[entity.otherId];
      const destinationNode = entities[hostId];

      if (sourceNode && destinationNode) {
        connections.push({
          sourceNode: sourceNode.sceneObjectInstance || sourceNode,
          destinationNode: destinationNode.sceneObjectInstance || destinationNode,
          entity
        });
      }
    });

    for (let i = 0, length = connections.length; i < length; i++) {
      this.updateEntities(connections
        .map(connection => {
          return {
            NodeType: this.connectionNodeType,
            params: {
              id: connection.entity.id,
              entity: connection.entity,
              sourceNode: connection.sourceNode,
              destinationNode: connection.destinationNode,
              bidirectional: connection.entity.bidirectional || false
            }
          };
        })
      );
    }
  }

  clearConnections() {
    this.updateEntities([]);
  }

  dispose() {
    this.clearConnections();

    super.dispose();
  }
}

import {emptyList} from 'in-services/fixedImmutables';
import Node from 'in-map/SceneGraph/Node';


export default class ConnectionHandlerNode extends Node {

  constructor(params) {
    super({params});

    this.connectionNodeType = params.connectionNodeType;
  }

  createConnections(entity, entities) {
    const hostId = entity.get('id');
    const outgoing = entity.get('outgoingConnections', emptyList);
    const incoming = entity.get('incomingConnections', emptyList);
    const connections = [];

    outgoing.forEach(entity => {
      const sourceNode = entities[hostId];
      const destinationNode = entities[entity.get('otherId')];

      if (sourceNode && destinationNode) {
        connections.push({
          sourceNode,
          destinationNode,
          entity
        });
      }
    });

    incoming.forEach(entity => {
      const sourceNode = entities[entity.get('otherId')];
      const destinationNode = entities[hostId];

      if (sourceNode && destinationNode) {
        connections.push({
          sourceNode,
          destinationNode,
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
              id: connection.entity.get('id'),
              entity: connection.entity,
              sourceNode: connection.sourceNode,
              destinationNode: connection.destinationNode
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

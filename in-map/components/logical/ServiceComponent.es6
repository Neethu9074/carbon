import React from 'react';

import ConnectionComponent from 'in-map/components/logical/ConnectionComponent';
import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import services from 'in-map/stores/logical/servicesStore';
import Service from 'in-map/sceneObjects/logical/Service';
import connectTo from 'in-hoc/connectTo';


export default sceneObjectComponent(props => {
  return {
    InstanceType: Service,
    params: {
      id: props.entity.get('id'),
      entity: props.entity
    }
  };
}, ServiceComponent);

function ServiceComponent({entity}) {
  const serviceId = entity.get('id');
  const outgoingConnections = entity.get('outgoingConnections');
  const incomingConnections = entity.get('incomingConnections');

  return (
    <div>
      {outgoingConnections.map(connectionEntity => <ConnectionSpawner key={connectionEntity.get('id')}
                                                                      sourceId={serviceId}
                                                                      destinationId={connectionEntity.get('otherId')}
                                                                      entity={connectionEntity} />
      )}
      {incomingConnections.map(connectionEntity => <ConnectionSpawner key={connectionEntity.get('id')}
                                                                      sourceId={connectionEntity.get('otherId')}
                                                                      destinationId={serviceId}
                                                                      entity={connectionEntity} />
      )}
    </div>
  );
}

const ConnectionSpawner = connectTo(() => {
  return {
    _services: services.stream.debounce(50)
  };
}, function ConnectionSpawner({_services, sourceId, destinationId, entity}) {
  if (!_services) {
    return null;
  }

  const sourceNode = _services.objects[sourceId];
  const destinationNode = _services.objects[destinationId];
  if (!sourceNode || !destinationNode) {
    return null;
  }

  return (
    <ConnectionComponent entity={entity}
                         sourceNode={sourceNode}
                         destinationNode={destinationNode} />
  );
});

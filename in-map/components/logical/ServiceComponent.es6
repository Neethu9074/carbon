import React from 'react';

import ConnectionComponent from 'in-map/components/logical/ConnectionComponent';
import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import Service from 'in-map/sceneObjects/logical/Service';
import services from 'in-map/stores/logical/services';
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
  const connections = entity.get('outgoingConnections');

  return (
    <div>
      {connections.map(connectionEntity =>
        <ConnectionSpawner key={connectionEntity.get('id')}
                           sourceID={serviceId}
                           entity={connectionEntity} />
      )}
    </div>
  );
}

const ConnectionSpawner = connectTo(() => {
  return {
    _services: services.stream.debounce(100)
  };
}, function ConnectionSpawner({_services, sourceID, entity}) {
  if (!_services) {
    return null;
  }

  const sourceNode = _services.objects[sourceID];
  const destinationNode = _services.objects[entity.get('otherId')];
  if (!sourceNode || !destinationNode) {
    return null;
  }

  return (
    <ConnectionComponent entity={entity}
                         sourceNode={sourceNode}
                         destinationNode={destinationNode} />
  );
});

import React from 'react';

import ConnectionComponent from 'in-map/components/physical/ConnectionComponent';
import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import LayerComponent from 'in-map/components/physical/LayerComponent';
import Node from 'in-map/sceneObjects/physical/Node';
import connectTo from 'in-hoc/connectTo';


export default sceneObjectComponent(props => {
  return {
    InstanceType: Node,
    params: {
      id: props.entity.get('id'),
      entity: props.entity,
      group: props.group
    }
  };
},
connectTo(props => {
  return {
    isHighlighted: props.sceneObject.eventEmitter.on('isHighlighted')
  };
}, NodeComponent)
);

function NodeComponent({entity, includedIds, sceneObject, isHighlighted}) {
  const layer = [];
  entity.get('children').forEach(layerEntity => {
    const layerId = layerEntity.get('id');
    if (includedIds.layerIds[layerId]) {
      layer.push(layerEntity);
    }
  });

  return (
    <div>
      {layer.map(layerEntity => <LayerComponent key={layerEntity.get('id')}
                                                node={sceneObject}
                                                entity={layerEntity} />
      )}
      {isHighlighted ? <Connections entity={entity} /> : null}
    </div>
  );
}

function Connections({entity}) {
  const outgoing = entity.get('outgoingConnections');
  const incoming = entity.get('incomingConnections');
  const nodeEntityId = entity.get('id');

  return (
    <ul>
      {outgoing.map(connectionEntity => <ConnectionComponent key={connectionEntity.get('id')}
                                                             sourceId={nodeEntityId}
                                                             destinationId={connectionEntity.get('otherId')}
                                                             entity={connectionEntity} />
      )}
      {incoming.map(connectionEntity => <ConnectionComponent key={connectionEntity.get('id')}
                                                             sourceId={connectionEntity.get('otherId')}
                                                             destinationId={nodeEntityId}
                                                             entity={connectionEntity} />
      )}
    </ul>
  );
}

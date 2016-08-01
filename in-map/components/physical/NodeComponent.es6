import React from 'react';

import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import LayerComponent from 'in-map/components/physical/LayerComponent';
import Node from 'in-map/sceneObjects/physical/Node';


export default sceneObjectComponent(props => {
  return {
    InstanceType: Node,
    params: {
      id: props.entity.get('id'),
      entity: props.entity,
      group: props.group
    }
  };
}, NodeComponent
);

function NodeComponent({entity, includedIds, sceneObject}) {
  const layer = [];
  entity.get('children').forEach(layerEntity => {
    const layerId = layerEntity.get('id');
    if (includedIds.layerIds[layerId]) {
      layer.push(layerEntity);
    }
  });

  if (layer.length === 0) {
    return null;
  }

  return (
    <div>
      {layer.map(layerEntity => <LayerComponent key={layerEntity.get('id')}
                                                node={sceneObject}
                                                entity={layerEntity} />
      )}
    </div>
  );
}

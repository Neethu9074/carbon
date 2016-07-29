import React from 'react';

import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import NodeComponent from 'in-map/components/physical/NodeComponent';
import Group from 'in-map/sceneObjects/physical/Group';


export default sceneObjectComponent(props => {
  return {
    InstanceType: Group,
    params: {
      id: props.entity.get('id'),
      entity: props.entity
    }
  };
}, GroupComponent );


function GroupComponent({entity, includedIds, sceneObject}) {
  const nodes = [];
  entity.get('children').forEach(nodeEntity => {
    const nodeId = nodeEntity.get('id');
    if (includedIds.hostIds[nodeId]) {
      nodes.push(nodeEntity);
    }
  });

  if (nodes.length === 0) {
    return null;
  }

  return (
    <div>
      {nodes.map(nodeEntity => <NodeComponent key={nodeEntity.get('id')}
                                              includedIds={includedIds}
                                              group={sceneObject}
                                              entity={nodeEntity} />
      )}
    </div>
  );
}

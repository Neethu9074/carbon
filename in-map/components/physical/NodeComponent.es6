import React from 'react';

import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
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

function NodeComponent({}) {
  return (
    <div />
  );
}

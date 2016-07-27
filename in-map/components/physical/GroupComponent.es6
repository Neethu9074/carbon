import React from 'react';

import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import Group from 'in-map/sceneObjects/physical/Group';


export default sceneObjectComponent(props => {
  return {
    InstanceType: Group,
    params: {
      id: props.entity.get('id'),
      entity: props.entity
    }
  };
}, GroupComponent
);

function GroupComponent({}) {
  return (
    <div />
  );
}

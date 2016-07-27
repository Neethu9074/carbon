import React from 'react';

import PhysicalMapComponent from 'in-map/components/physical/MapComponent';
import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import LogicalMapComponent from 'in-map/components/logical/MapComponent';
import {view$, types as views} from 'in-stores/view';
import Scene from 'in-map/sceneObjects/Scene';
import connectTo from 'in-hoc/connectTo';


export default sceneObjectComponent(props => {
  return {
    InstanceType: Scene,
    params: {
      canvas: props.canvas
    }
  };
}, connectTo({
     view: view$
   }, SceneComponent)
);

function SceneComponent({view}) {
  if (view === views.physical) {
    return <PhysicalMapComponent />;
  } else if (view === views.process) {
    return <LogicalMapComponent />;
  }

  return null;
}

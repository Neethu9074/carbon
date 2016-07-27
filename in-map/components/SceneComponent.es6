import React from 'react';

import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import MapComponent from 'in-map/components/physical/MapComponent';
import Scene from 'in-map/sceneObjects/Scene';


export default sceneObjectComponent(props => {
  return {
    InstanceType: Scene,
    params: {
      canvas: props.canvas
    }
  };
}, SceneComponent);

function SceneComponent() {
  return (
    <MapComponent />
  );
}

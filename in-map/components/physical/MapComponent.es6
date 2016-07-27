import React from 'react';

import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import Map from 'in-map/sceneObjects/physical/Map';


export default sceneObjectComponent(() => {
  return {
    InstanceType: Map,
    params: {}
  };
}, MapComponent);

function MapComponent() {
  return (
    <div />
  );
}

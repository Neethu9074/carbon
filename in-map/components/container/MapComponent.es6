import React from 'react';

import {getViewStructure} from 'in-map/stores/container/viewStructureStore';
import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import Map from 'in-map/sceneObjects/container/Map';
import connectTo from 'in-hoc/connectTo';


export default sceneObjectComponent(props => {
  return {
    InstanceType: Map,
    params: {
      id: 'physical_map',
      scene: props.scene
    }
  };
}, connectTo({
     structure: getViewStructure()
   }, MapComponent)
);

function MapComponent({structure}) {
  if (!structure) {
    return null;
  }

  return (
    <div>
      container map here
    </div>
  );
}

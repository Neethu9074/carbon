import React from 'react';

import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import ServiceComponent from 'in-map/components/logical/ServiceComponent';
import {getViewStructure} from 'in-map/stores/logical/viewStructure';
import Map from 'in-map/sceneObjects/logical/Map';
import connectTo from 'in-hoc/connectTo';


export default sceneObjectComponent(props => {
  return {
    InstanceType: Map,
    params: {
      id: 'logical_map',
      scene: props.scene
    }
  };
}, connectTo({
     viewStructure: getViewStructure()
   }, MapComponent)
 );

function MapComponent({viewStructure}) {
  if (!viewStructure) {
    return null;
  }

  const services = viewStructure.get('children');
  if (services.size === 0) {
    return null;
  }

  return (
    <div>
      {services.map(serviceEntity => {
        return (
          <ServiceComponent key={serviceEntity.get('id')}
                            entity={serviceEntity} />
        );
      })}
    </div>
  );
}

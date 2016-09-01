import React from 'react';

import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import ServiceComponent from 'in-map/components/logical/ServiceComponent';
import {getViewStructure} from 'in-map/stores/logical/viewStructureStore';
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
     structure: getViewStructure()
   }, MapComponent)
 );

function MapComponent({structure}) {
  if (!structure) {
    return null;
  }

  const services = structure.viewStructure.get('children');
  if (services.size === 0) {
    return null;
  }

  return (
    <div>
      {services.map(serviceEntity => {
        const serviceId = serviceEntity.get('id');
        if (!structure.includedIds.serviceIds[serviceId]) {
          return null;
        }
        return (
          <ServiceComponent key={serviceId}
                            entity={serviceEntity} />
        );
      })}
    </div>
  );
}

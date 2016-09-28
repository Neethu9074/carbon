import React from 'react';

import {getViewStructure} from 'in-map/stores/physical/viewStructureStore';
import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import GroupComponent from 'in-map/components/physical/GroupComponent';
import Map from 'in-map/sceneObjects/physical/Map';
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

  const includedGroupIds = structure.includedIds.groupIds;
  const groups = structure.viewStructure.get('children');

  return (
    <div style={{
      display: 'none'
    }}>
      {groups.map(groupEntity => {
        const groupId = groupEntity.get('id');
        if (!includedGroupIds[groupId]) {
          return null;
        }
        return (
          <GroupComponent key={groupId}
                          includedIds={structure.includedIds}
                          entity={groupEntity} />
        );
      })}
    </div>
  );
}

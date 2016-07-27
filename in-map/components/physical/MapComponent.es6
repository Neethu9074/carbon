import React from 'react';

import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import GroupComponent from 'in-map/components/physical/GroupComponent';
import {getViewStructure} from 'in-map/stores/physical/viewStructure';
import Map from 'in-map/sceneObjects/physical/Map';
import connectTo from 'in-hoc/connectTo';


export default sceneObjectComponent(() => {
  return {
    InstanceType: Map,
    params: {
      id: 'physical_map'
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
    <div>
      {groups.map(groupEntity => {
        const groupId = groupEntity.get('id');
        if (!includedGroupIds[groupId]) {
          return null;
        }
        return (
          <GroupComponent key={groupId}
                          entity={groupEntity} />
        );
      })}
    </div>
  );
}

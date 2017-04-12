import {getViewStructure} from 'in-map/stores/physical/viewStructureStore';
import GroupNode from 'in-map/SceneGraph/physical/GroupNode';
import Map from 'in-map/sceneObjects/physical/Map';
import Node from 'in-map/SceneGraph/Node';


export default class MapNode extends Node {

  constructor(params) {
    super({InstanceType: Map, params});

    this.addSubscription(
      getViewStructure().subscribe(structure => {
        const includedIds = structure.includedIds;
        const groups = structure.viewStructure.children;

        const filteredGroups = [];
        let filteredGroupsIndex = 0;
        for (let i = 0, length = groups.length; i < length; i++) {
          const group = groups[i];
          if (includedIds.groupIds[group.id]) {
            filteredGroups[filteredGroupsIndex++] = {
              NodeType: GroupNode,
              params: {
                id: group.id,
                entity: group,
                includedIds
              }
            };
          }
        }

        this.updateEntities(filteredGroups);
      })
    );
  }
}

import {getViewStructure} from 'in-map/stores/container/viewStructureStore';
import GroupNode from 'in-map/SceneGraph/physical/GroupNode';
import Map from 'in-map/sceneObjects/physical/Map';
import Node from 'in-map/SceneGraph/Node';


export default class MapNode extends Node {

  constructor(params) {
    super({InstanceType: Map, params});

    this.addSubscription(
      getViewStructure().subscribe(structure => {
        const includedIds = structure.includedIds;
        const groups = structure.viewStructure.get('children');

        this.updateEntities(groups
          .toArray()
          .filter(entity => includedIds.groupIds[entity.get('id')])
          .map(entity => {
            return {
              NodeType: GroupNode,
              params: {
                id: entity.get('id'),
                entity,
                includedIds
              }
            };
          })
        );
      })
    );
  }
}

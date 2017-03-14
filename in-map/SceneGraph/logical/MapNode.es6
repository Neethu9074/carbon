import {getViewStructure} from 'in-map/stores/logical/viewStructureStore';
import ServiceNode from 'in-map/SceneGraph/logical/ServiceNode';
import Map from 'in-map/sceneObjects/logical/Map';
import Node from 'in-map/SceneGraph/Node';


export default class MapNode extends Node {

  constructor(params) {
    super({InstanceType: Map, params});

    this.addSubscription(
      getViewStructure().subscribe(structure => {
        const includedIds = structure.includedIds;
        const services = structure.viewStructure.get('children');

        this.updateEntities(services
          .toArray()
          .filter(entity => includedIds.serviceIds[entity.get('id')])
          .map(entity => {
            return {
              NodeType: ServiceNode,
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

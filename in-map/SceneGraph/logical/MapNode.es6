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
        const services = structure.viewStructure.children;

        this.updateEntities(services
          .filter(entity => includedIds.serviceIds[entity.id])
          .map(entity => {
            return {
              NodeType: ServiceNode,
              params: {
                id: entity.id,
                entity,
                includedIds
              }
            };
          })
        );

        const childrenAsArray = Object.keys(this.children);
        for (let i = 0, length = childrenAsArray.length; i < length; i++) {
          const serviceId = childrenAsArray[i];
          const service = this.children[serviceId];
          service.updateConnections(this.children);
        }
      })
    );
  }
}

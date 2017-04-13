import ServiceConnectionNode from 'in-map/SceneGraph/logical/ServiceConnectionNode';
import ConnectionHandlerNode from 'in-map/SceneGraph/ConnectionHandlerNode';
import Service from 'in-map/sceneObjects/logical/Service';
import Node from 'in-map/SceneGraph/Node';

export default class ServiceNode extends Node {
  constructor(params) {
    super({ InstanceType: Service, params });

    this.connectionHandlerNode = new ConnectionHandlerNode({
      params: {
        id: `connectionNodeFor${params.id}`
      },
      connectionNodeType: ServiceConnectionNode
    });
  }

  updateConnections(servicesAsSceneObjects) {
    this.connectionHandlerNode.createConnections(this.params.entity, servicesAsSceneObjects);
  }

  update(oldParams, newParams) {
    const serviceInstances = newParams.entity.children;
    this.sceneObjectInstance.setServiceInstances(
      serviceInstances.filter(si => newParams.includedIds.serviceInstanceIds[si.id])
    );
  }

  dispose() {
    this.connectionHandlerNode.dispose();
    this.services = null;
    this.entity = null;

    super.dispose();
  }
}

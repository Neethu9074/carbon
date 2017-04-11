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

  dispose() {
    this.connectionHandlerNode.dispose();
    this.services = null;
    this.entity = null;

    super.dispose();
  }
}

import ServiceConnectionNode from 'in-map/SceneGraph/logical/ServiceConnectionNode';
import ConnectionHandlerNode from 'in-map/SceneGraph/ConnectionHandlerNode';
import {CONNECTIONS_NODE_CHECKING} from 'in-map/misc/TimingConfig';
import services from 'in-map/stores/logical/servicesStore';
import Service from 'in-map/sceneObjects/logical/Service';
import Node from 'in-map/SceneGraph/Node';


export default class ServiceNode extends Node {

  constructor(params) {
    super({InstanceType: Service, params});

    this.connectionHandlerNode = new ConnectionHandlerNode({
      params: {
        id: `connectionNodeFor${params.id}`
      },
      connectionNodeType: ServiceConnectionNode
    });

    this.addSubscription(
      services.stream.debounce(CONNECTIONS_NODE_CHECKING).subscribe(_services => {
        this.services = _services;
        this.updateConnections();
      })
    );
  }

  update(params) {
    this.entity = params.entity;
    this.updateConnections();
  }

  updateConnections() {
    if (this.entity && this.services) {
      this.connectionHandlerNode.createConnections(this.entity, this.services);
    }
  }

  dispose() {
    this.connectionHandlerNode.dispose();
    this.services = null;
    this.entity = null;

    super.dispose();
  }
}

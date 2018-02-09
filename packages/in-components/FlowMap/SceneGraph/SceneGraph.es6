import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import layout from 'in-components/FlowMap/misc/flowLayouting/flowLayouter';
// import Connection from 'in-components/FlowMap/sceneObjects/Connection';
import Node from 'in-components/FlowMap/sceneObjects/Node';

export default class SceneGraph {
  constructor(serviceLocatorUid, rootNodeId) {
    this.serviceLocatorUid = serviceLocatorUid;
    this.rootNodeId = rootNodeId;

    this.connectionsMap = new Map();
  }

  addNode(data) {
    const node = new Node(this.serviceLocatorUid, data.id);
    getServiceLocators(this.serviceLocatorUid).nodesServiceLocator.addNode(node.id, node);

    this.relayout();
    return node;
  }

  relayout() {
    const serviceLocators = getServiceLocators(this.serviceLocatorUid);
    const nodes = serviceLocators.nodesServiceLocator.getNodes();
    layout(nodes.get(this.rootNodeId), nodes, this.connectionsMap);

    getServiceLocators(this.serviceLocatorUid).connectionsServiceLocator.update();

    getServiceLocators(this.serviceLocatorUid)
      .sceneServiceLocator.getScene()
      .requestRendering();
  }

  disposeMap(map) {
    const items = map.values();
    for (const item of items) {
      item.dispose();
    }

    map.clear();
  }

  dispose() {
    this.disposeMap(this.connectionsMap);
    this.connectionsMap = null;

    this.serviceLocatorUid = null;
    this.rootNodeId = null;
    this.data = null;
  }
}

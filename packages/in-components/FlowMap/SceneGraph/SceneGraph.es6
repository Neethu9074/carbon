import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import layout from 'in-components/FlowMap/misc/flowLayouting/flowLayouter';
// import Connection from 'in-components/FlowMap/sceneObjects/Connection';
import Node from 'in-components/FlowMap/sceneObjects/Node';

export default class SceneGraph {
  constructor(serviceLocatorUid, rootNodeId) {
    this.serviceLocatorUid = serviceLocatorUid;
    this.rootNodeId = rootNodeId;
    this.subscriptions = new Map();

    this.connectionsMap = new Map();
  }

  init(rootNodeData) {
    const rootNode = this.addNode(rootNodeData);
    rootNode.expandRight();
    rootNode.expandLeft();
  }

  fetchIncomingDataForNodeId(id, getIncomingDataForNodeIdCallback) {
    this.setupSubscriptionIfAbsent(id, 'incoming', getIncomingDataForNodeIdCallback, result => {
      console.log('result in', result);
    });
  }

  fetchOutgoingDataForNodeId(id, getOutgoingDataForNodeIdCallback) {
    this.setupSubscriptionIfAbsent(id, 'outgoing', getOutgoingDataForNodeIdCallback, result => {
      console.log('result out', result);
    });
  }

  setupSubscriptionIfAbsent(id, direction, fetchData, callback) {
    if (!this.containsSubscription(id, direction)) {
      const directionSubscriptions = this.subscriptions.get(id) || {};
      directionSubscriptions[direction] = fetchData(id).subscribe(callback);
      this.subscriptions.set(id, directionSubscriptions);
    }
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

  containsSubscription(id, direction) {
    const directionSubscriptions = this.subscriptions.get(id);
    return directionSubscriptions && directionSubscriptions[direction] ? true : false;
  }

  disposeMap(map) {
    const items = map.values();
    for (const item of items) {
      item.dispose();
    }

    map.clear();
  }

  disposeOpenDataSubscriptionsForNodeId(id) {
    this.disposeSubscription(id, 'incoming');
    this.disposeSubscription(id, 'outgoing');
  }

  disposeSubscription(id, direction) {
    const directionSubscriptions = this.subscriptions.get(id);
    if (directionSubscriptions[direction]) {
      directionSubscriptions[direction].dispose();
      delete directionSubscriptions[direction];
    }
  }

  dispose() {
    this.disposeMap(this.connectionsMap);
    this.connectionsMap = null;

    this.serviceLocatorUid = null;
    this.rootNodeId = null;
    this.data = null;
  }
}

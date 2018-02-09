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
    this.addNode(rootNodeData);
    // const rootNode = this.addNode(rootNodeData);
    // rootNode.expandRight();
    // rootNode.expandLeft();
  }

  addNode(data) {
    const node = new Node(this.serviceLocatorUid, data.id);
    getServiceLocators(this.serviceLocatorUid).nodesServiceLocator.addNode(node.id, node);

    this.relayout();
    return node;
  }

  fetchIncomingDataForNodeId(id, getIncomingDataForNodeIdCallback) {
    this.setupSubscriptionIfAbsent(id, 'incoming', getIncomingDataForNodeIdCallback);
  }

  fetchOutgoingDataForNodeId(id, getOutgoingDataForNodeIdCallback) {
    this.setupSubscriptionIfAbsent(id, 'outgoing', getOutgoingDataForNodeIdCallback);
  }

  setupSubscriptionIfAbsent(id, direction, fetchData) {
    if (!this.containsSubscription(id, direction)) {
      const directionSubscriptions = this.subscriptions.get(id) || {};
      directionSubscriptions[direction] = fetchData(id).subscribe(result => this.processResult(id, direction, result));
      this.subscriptions.set(id, directionSubscriptions);
    }
  }

  containsSubscription(id, direction) {
    const directionSubscriptions = this.subscriptions.get(id);
    return directionSubscriptions && directionSubscriptions[direction] ? true : false;
  }

  processResult(nodeId, direction, result) {
    const nodes = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator.getNodes();
    const node = nodes.get(nodeId);

    const isLoading = result.progress.loading;
    const hasErrors = result.errors.length > 0;
    if (isLoading) {
      if (direction === 'incoming') {
        node.setLoadingOutgoingData(false);
        node.setLoadingIncomingData(true);
      } else {
        node.setLoadingIncomingData(false);
        node.setLoadingOutgoingData(true);
      }
      return;
    } else {
      node.setLoadingOutgoingData(false);
      node.setLoadingIncomingData(false);
    }

    if (hasErrors) {
      return;
    }
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

import RoEmitter from 'roemitter';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import layout from 'in-components/FlowMap/misc/flowLayouting/flowLayouter';
import Connection from 'in-components/FlowMap/sceneObjects/Connection';
import Node from 'in-components/FlowMap/sceneObjects/Node';

export default class SceneGraph {
  constructor(serviceLocatorUid, rootNodeId) {
    this.serviceLocatorUid = serviceLocatorUid;
    this.rootNodeId = rootNodeId;
    this.subscriptions = new Map();
    this.signals = new RoEmitter('sceneGraphSignals');

    this.connectionsMap = new Map();
    this.initSubscriptions();
  }

  init(rootNodeData) {
    this.addNode(this.rootNodeId, rootNodeData);
    // const rootNode = this.addNode(this.rootNodeId, rootNodeData);
    // rootNode.expandRight();
    // rootNode.expandLeft();
    this.requestLayout();
  }

  initSubscriptions() {
    this.layoutSubscription = this.signals
      .on('layout')
      .debounce(200)
      .subscribe(() => this.relayout());
  }

  addNode(id) {
    const nodesServiceLocator = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator;
    const nodes = nodesServiceLocator.getNodes();
    if (nodes.has(id)) {
      return nodes.get(id);
    }

    const node = new Node(this.serviceLocatorUid, id);
    nodesServiceLocator.addNode(node.id, node);

    return node;
  }

  fetchIncomingDataForNodeId(id, getIncomingDataForNodeIdCallback) {
    const direction = 'incoming';
    this.setupSubscriptionIfAbsent(id, direction, getIncomingDataForNodeIdCallback, (nodeId, result) => {
      this.processResult(nodeId, result, direction);
      this.requestLayout();
    });
  }

  fetchOutgoingDataForNodeId(id, getOutgoingDataForNodeIdCallback) {
    const direction = 'outgoing';
    this.setupSubscriptionIfAbsent(id, direction, getOutgoingDataForNodeIdCallback, (nodeId, result) => {
      this.processResult(nodeId, result, direction);
      this.requestLayout();
    });
  }

  setupSubscriptionIfAbsent(id, direction, fetchData, processResult) {
    if (!this.containsSubscription(id, direction)) {
      const directionSubscriptions = this.subscriptions.get(id) || {};
      directionSubscriptions[direction] = fetchData(id).subscribe(result => processResult(id, result));
      this.subscriptions.set(id, directionSubscriptions);
    }
  }

  containsSubscription(id, direction) {
    const directionSubscriptions = this.subscriptions.get(id);
    return directionSubscriptions && directionSubscriptions[direction] ? true : false;
  }

  processResult(nodeId, result, direction) {
    const currentNode = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator.getNodes();
    const node = currentNode.get(nodeId);

    const hasErrors = result.errors.length > 0;
    if (hasErrors) {
      // TODO: what should happen on error here?
      return;
    }

    const isLoading = result.progress.loading;
    node.setIsLoadingData(isLoading, direction);
    if (isLoading) {
      return;
    }

    const nodesMap = this.getNodesAsMap(result.data);
    let { newNodes, presentNodes, removedNodes } = this.getNewDeletedAndPresentNodesFromLists(
      node[direction].map(node => node.id),
      Array.from(nodesMap.keys())
    );

    // TODO: remove until we have proper backend data in place. This avoids that we receive the node itself on subscribe for incoming/outgoing data
    newNodes = newNodes.filter(id => id !== node.id);

    // TODOS #################################################################################
    // - create proper data in the backend with more than 1 depth
    // - create connections on the fly while layouting and create geometry there

    this.addNewNodes(node, newNodes, nodesMap, direction);
    node.setConnected(newNodes, direction);

    this.updatePresentNodes(presentNodes);
    this.removeNodes(removedNodes);
  }

  getNodesAsMap(nodes) {
    const dataFetchingService = getServiceLocators(this.serviceLocatorUid).dataFetchingServiceLocator;

    const nodesMap = new Map();
    for (let i = 0; i < nodes.length; i++) {
      const nodeData = nodes[i];
      nodesMap.set(dataFetchingService.getIdFromData(nodeData), nodeData);
    }
    return nodesMap;
  }

  getNewDeletedAndPresentNodesFromLists(currentNodes, nextNodes) {
    const result = {
      newNodes: [],
      presentNodes: [],
      removedNodes: []
    };

    for (let i = 0; i < currentNodes.length; i++) {
      const currentNode = currentNodes[i];
      if (nextNodes.indexOf(currentNode) === -1) {
        result.removedNodes.push(currentNode);
      } else {
        result.presentNodes.push(currentNode);
      }
    }

    for (let i = 0; i < nextNodes.length; i++) {
      const nextNode = nextNodes[i];
      if (currentNodes.indexOf(nextNode) === -1) {
        result.newNodes.push(nextNode);
      }
    }

    return result;
  }

  addNewNodes(node, newNodes, nodesMap, direction) {
    for (let i = 0; i < newNodes.length; i++) {
      const nodeSceneObject = this.addNode(newNodes[i]);

      let connection;
      if (direction === 'incoming') {
        nodeSceneObject.setIsExpanded(true, 'outgoing');
        connection = new Connection(this.serviceLocatorUid, nodeSceneObject, node);
      } else {
        nodeSceneObject.setIsExpanded(true, 'incoming');
        connection = new Connection(this.serviceLocatorUid, node, nodeSceneObject);
      }

      this.connectionsMap.set(connection.id, connection);
    }
  }

  updatePresentNodes() {
    // TODO: discuss what happens here
  }

  removeNodes(nodeIds) {
    const nodesServiceLocator = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator;
    for (let i = 0; i < nodeIds.length; i++) {
      nodesServiceLocator.removeNode(nodeIds[i]);
    }

    // TODO: remove connections touching this node
  }

  requestLayout() {
    this.signals.emit('layout', true);
  }

  relayout() {
    const serviceLocators = getServiceLocators(this.serviceLocatorUid);
    const nodesMpa = serviceLocators.nodesServiceLocator.getNodes();
    layout(nodesMpa.get(this.rootNodeId), nodesMpa, this.connectionsMap);

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
    if (directionSubscriptions && directionSubscriptions[direction]) {
      directionSubscriptions[direction].dispose();
      delete directionSubscriptions[direction];
    }
  }

  dispose() {
    this.layoutSubscription.dispose();
    this.layoutSubscription = null;

    this.signals.dispose();
    this.signals = null;

    this.disposeMap(this.connectionsMap);
    this.connectionsMap = null;

    this.serviceLocatorUid = null;
    this.rootNodeId = null;
    this.data = null;
  }
}

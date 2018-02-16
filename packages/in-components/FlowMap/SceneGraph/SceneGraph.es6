import RoEmitter from 'roemitter';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import layout from 'in-components/FlowMap/misc/flowLayouting/flowLayouter';
import PathFinder from 'in-components/FlowMap/misc/PathFinder';
import Node from 'in-components/FlowMap/sceneObjects/Node';
import { diff } from 'in-services/arrayUtils';

export default class SceneGraph {
  constructor(serviceLocatorUid, rootNodeId) {
    this.serviceLocatorUid = serviceLocatorUid;
    this.rootNodeId = rootNodeId;
    this.subscriptions = new Map();
    this.signals = new RoEmitter('sceneGraphSignals');
    this.pathFinder = new PathFinder(serviceLocatorUid, rootNodeId);

    this.initSubscriptions();
  }

  init(rootNodeData) {
    const rootNode = this.addOrUpdateNode(this.rootNodeId, rootNodeData);
    rootNode.expandRight();
    rootNode.expandLeft();
    this.requestLayout();
  }

  initSubscriptions() {
    this.layoutSubscription = this.signals
      .on('layout')
      .debounce(200)
      .subscribe(() => this.relayout());
  }

  addOrUpdateNode(id, data) {
    const nodesServiceLocator = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator;
    const nodes = nodesServiceLocator.getNodes();
    if (nodes.has(id)) {
      const node = nodes.get(id);
      node.setData(data);
      return node;
    }

    const node = new Node(this.serviceLocatorUid, id);
    node.setData(data);

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
      directionSubscriptions[direction] = fetchData(id, this.pathFinder.find(id, direction)).subscribe(result =>
        processResult(id, result)
      );
      this.subscriptions.set(id, directionSubscriptions);
    }
  }

  containsSubscription(id, direction) {
    const directionSubscriptions = this.subscriptions.get(id);
    return directionSubscriptions && directionSubscriptions[direction] ? true : false;
  }

  processResult(nodeId, result, direction) {
    const currentNodes = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator.getNodes();
    const node = currentNodes.get(nodeId);

    const hasErrors = result.errors.length > 0;
    if (hasErrors) {
      node.resetConnected(direction);
      // TODO: what should happen on error?
      return;
    }

    const isLoading = result.progress.loading;
    node.setIsLoadingData(isLoading, direction);
    if (isLoading) {
      return;
    }

    const nodesMap = this.getNodesAsMap(result.data);

    const difference = diff(node[direction].map(node => node.id), Array.from(nodesMap.keys()));
    const newNodes = difference.uniqueItemsB;
    const presentNodes = difference.sharedItems;
    const removedNodes = difference.uniqueItemsA;

    this.addNewNodes(node, newNodes, nodesMap, direction);
    node.setConnected(newNodes, direction);

    this.updatePresentNodes(presentNodes, nodesMap);
    this.removeNodes(removedNodes);

    // TODO: take related nodes count or sub children into account
  }

  getNodesAsMap(nodes) {
    const nodesMap = new Map();
    for (let i = 0; i < nodes.length; i++) {
      const nodeData = nodes[i];
      nodesMap.set(nodeData.entity.id, nodeData);
    }
    return nodesMap;
  }

  addNewNodes(node, newNodes, nodesMap, direction) {
    for (let i = 0; i < newNodes.length; i++) {
      const nodeId = newNodes[i];
      const nodesData = nodesMap.get(nodeId).entity;
      const nodeSceneObject = this.addOrUpdateNode(nodeId, nodesData);

      if (direction === 'incoming') {
        nodeSceneObject.setIsExpanded(true, 'outgoing');
      } else {
        nodeSceneObject.setIsExpanded(true, 'incoming');
      }
    }
  }

  updatePresentNodes(presentNodes, nodesMap) {
    for (let i = 0; i < presentNodes.length; i++) {
      const nodeId = presentNodes[i];
      const nodesData = nodesMap.get(nodeId).entity;
      this.addOrUpdateNode(nodeId, nodesData);
    }
  }

  removeNodes(nodeIds) {
    const nodesServiceLocator = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator;
    for (let i = 0; i < nodeIds.length; i++) {
      nodesServiceLocator.removeNode(nodeIds[i]);
    }
  }

  requestLayout() {
    this.signals.emit('layout', true);
  }

  relayout() {
    const serviceLocators = getServiceLocators(this.serviceLocatorUid);
    const nodesMap = serviceLocators.nodesServiceLocator.getNodes();
    layout(nodesMap.get(this.rootNodeId), nodesMap);

    this.updateConnections(nodesMap);

    getServiceLocators(this.serviceLocatorUid)
      .sceneServiceLocator.getScene()
      .requestRendering();
  }

  updateConnections(nodesMap) {
    const nodes = nodesMap.objects.values();
    const connections = [];
    for (const node of nodes) {
      for (let i = 0; i < node.incoming.length; i++) {
        connections.push({ from: nodesMap.get(node.incoming[i]), to: node });
      }
      for (let i = 0; i < node.outgoing.length; i++) {
        connections.push({ from: node, to: nodesMap.get(node.outgoing[i]) });
      }
    }
    getServiceLocators(this.serviceLocatorUid).connectionsServiceLocator.set(connections);
    getServiceLocators(this.serviceLocatorUid).connectionsServiceLocator.update();
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

    this.serviceLocatorUid = null;
    this.rootNodeId = null;
    this.data = null;
  }
}

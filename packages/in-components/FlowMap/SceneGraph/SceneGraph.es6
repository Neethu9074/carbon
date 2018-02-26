import RoEmitter from 'roemitter';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import looseLayout from 'in-components/FlowMap/misc/layouting/looseLayouter';
import flowLayout from 'in-components/FlowMap/misc/layouting/flowLayouter';
import PathFinder from 'in-components/FlowMap/misc/PathFinder';
import Node from 'in-components/FlowMap/sceneObjects/Node';
import { diff } from 'in-services/arrayUtils';

export default class SceneGraph {
  constructor(serviceLocatorUid) {
    this.serviceLocatorUid = serviceLocatorUid;
    this.subscriptions = new Map();
    this.signals = new RoEmitter('sceneGraphSignals');
    this.pathFinder = new PathFinder(serviceLocatorUid);

    this.initSubscriptions();
  }

  initSubscriptions() {
    this.layoutSubscription = this.signals
      .on('layout')
      .debounce(200)
      .subscribe(() => this.relayout());
  }

  addRootNode(id, data) {
    this.rootNodeId = id;
    this.pathFinder.setRootNodeId(id);

    const rootNode = this.addNode(id, data);
    rootNode.expandRight();
    rootNode.expandLeft();

    this.requestLayout();
  }

  addNode(id, data, metricValues) {
    const nodesServiceLocator = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator;
    const node = new Node(this.serviceLocatorUid, id, metricValues);
    node.__originalId = data.id;
    node.setData(data);

    nodesServiceLocator.addNode(node.id, node);

    return node;
  }

  updateNode(id, data) {
    const nodesServiceLocator = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator;
    const nodes = nodesServiceLocator.getNodes();
    if (nodes.has(id)) {
      nodes.get(id).setData(data);
    }
  }

  fetchIncomingDataForNodeId(id, getIncomingDataForNodeIdCallback) {
    const direction = 'incoming';
    this.setupSubscriptionIfAbsent(id, direction, getIncomingDataForNodeIdCallback, (nodeId, result, path) => {
      this.processResult(nodeId, result, direction, path);
      this.requestLayout();
    });
  }

  fetchOutgoingDataForNodeId(id, getOutgoingDataForNodeIdCallback) {
    const direction = 'outgoing';
    this.setupSubscriptionIfAbsent(id, direction, getOutgoingDataForNodeIdCallback, (nodeId, result, path) => {
      this.processResult(nodeId, result, direction, path);
      this.requestLayout();
    });
  }

  setupSubscriptionIfAbsent(id, direction, fetchData, processResult) {
    if (!this.containsSubscription(id, direction)) {
      const directionSubscriptions = this.subscriptions.get(id) || {};
      const currentNodes = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator.getNodes();
      const path = this.pathFinder.find(id, direction).map(id => currentNodes.get(id).__originalId);

      directionSubscriptions[direction] = fetchData(id, path).subscribe(result => processResult(id, result, path));
      this.subscriptions.set(id, directionSubscriptions);
    }
  }

  containsSubscription(id, direction) {
    const directionSubscriptions = this.subscriptions.get(id);
    return directionSubscriptions && directionSubscriptions[direction] ? true : false;
  }

  processResult(nodeId, result, direction, path) {
    const currentNodes = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator.getNodes();
    const node = currentNodes.get(nodeId);

    const hasErrors = result.errors.length > 0;
    node.setErrorsInDirection(result.errors, direction);
    if (hasErrors) {
      return;
    }

    const isLoading = result.progress.loading;
    node.setIsLoadingData(isLoading, direction);
    if (isLoading) {
      return;
    }

    const nodes = (result.data || []).map(n => ({
      id: this.toUid(n.entity.id, path, direction),
      entity: n.entity,
      relatedNodesCount: n.relatedNodesCount,
      metrics: n.metrics
    }));
    const nodesMap = this.getNodesAsMap(nodes);

    const difference = diff(node[direction].map(node => node.id), Array.from(nodesMap.keys()));
    const newNodes = difference.uniqueItemsB;
    const presentNodes = difference.sharedItems;
    const removedNodes = difference.uniqueItemsA;

    this.addNewNodes(newNodes, nodesMap, direction);
    node.setConnected(newNodes, direction);

    this.updatePresentNodes(presentNodes, nodesMap);
    this.removeNodes(removedNodes);
  }

  toUid(id, previousNodesPath, direction) {
    let path;
    if (direction === 'incoming') {
      path = [id].concat(previousNodesPath);
    } else {
      path = previousNodesPath.concat([id]);
    }
    return path.join('__');
  }

  getNodesAsMap(nodes) {
    const nodesMap = new Map();
    for (let i = 0; i < nodes.length; i++) {
      const nodeData = nodes[i];
      nodesMap.set(nodeData.id, nodeData);
    }
    return nodesMap;
  }

  addNewNodes(newNodes, nodesMap, direction) {
    for (let i = 0; i < newNodes.length; i++) {
      const nodeId = newNodes[i];
      const nodesData = nodesMap.get(nodeId);
      const nodeSceneObject = this.addNode(nodeId, nodesData.entity, nodesData.metrics);

      if (direction === 'incoming') {
        nodeSceneObject.setIsExpanded(true, 'outgoing');
        if (nodesData.relatedNodesCount === 0) {
          nodeSceneObject.setIsExpanded(true, direction);
        }
      } else {
        if (nodesData.relatedNodesCount === 0) {
          nodeSceneObject.setIsExpanded(true, direction);
        }
        nodeSceneObject.setIsExpanded(true, 'incoming');
      }
    }
  }

  updatePresentNodes(presentNodes, nodesMap) {
    for (let i = 0; i < presentNodes.length; i++) {
      const nodeId = presentNodes[i];
      const nodesData = nodesMap.get(nodeId);
      this.updateNode(nodeId, nodesData.entity);
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

    if (this.rootNodeId) {
      flowLayout(nodesMap.get(this.rootNodeId), nodesMap);
    } else {
      looseLayout(nodesMap);
    }

    this.updateConnections(nodesMap);

    getServiceLocators(this.serviceLocatorUid)
      .sceneServiceLocator.getScene()
      .requestRendering();
  }

  updateConnections(nodesMap) {
    getServiceLocators(this.serviceLocatorUid).connectionsServiceLocator.update(nodesMap);
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

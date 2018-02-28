import RoEmitter from 'roemitter';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import EndpointPathFinder from 'in-components/FlowMap/misc/EndpointPathFinder';
import looseLayout from 'in-components/FlowMap/misc/layouting/looseLayouter';
import flowLayout from 'in-components/FlowMap/misc/layouting/flowLayouter';
import PathFinder from 'in-components/FlowMap/misc/PathFinder';
import Node from 'in-components/FlowMap/sceneObjects/Node';

export default class SceneGraph {
  constructor(serviceLocatorUid) {
    this.serviceLocatorUid = serviceLocatorUid;
    this.subscriptions = new Map();
    this.signals = new RoEmitter('sceneGraphSignals');
    this.pathFinder = new PathFinder(serviceLocatorUid);
    this.endpointPathfinder = new EndpointPathFinder(serviceLocatorUid);

    this.initSubscriptions();
  }

  initSubscriptions() {
    this.layoutSubscription = this.signals
      .on('layout')
      .debounce(200)
      .subscribe(() => this.relayout());
  }

  addRootNode({ service, endpoint }) {
    const id = service.id;
    this.rootNodeId = id;
    this.pathFinder.setRootNodeId(id);
    this.endpointPathfinder.setRootNodeId(id);

    const rootNode = this.addNode(id, service);

    if (endpoint) {
      const child = rootNode.addChild(endpoint);
      child.expandRight();
      child.expandLeft();
    } else {
      rootNode.expandRight();
      rootNode.expandLeft();
    }

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

  fetchIncomingDataForChildId(nodeId, endpointId, getIncomingDataForNodeIdCallback) {
    const direction = 'incoming';
    this.setupChildSubscriptionIfAbsent(
      nodeId,
      endpointId,
      direction,
      getIncomingDataForNodeIdCallback,
      (result, path) => {
        this.processEndpointResult(nodeId, endpointId, result, direction, path);
        this.requestLayout();
      }
    );
  }

  fetchOutgoingDataForChildId(nodeId, endpointId, getOutgoingDataForNodeIdCallback) {
    const direction = 'outgoing';
    this.setupChildSubscriptionIfAbsent(
      nodeId,
      endpointId,
      direction,
      getOutgoingDataForNodeIdCallback,
      (result, path) => {
        this.processEndpointResult(nodeId, endpointId, result, direction, path);
        this.requestLayout();
      }
    );
  }

  setupChildSubscriptionIfAbsent(nodeId, endpointId, direction, fetchData, processResult) {
    const id = `${nodeId}__${endpointId}`;
    if (!this.containsSubscription(id, direction)) {
      const directionSubscriptions = this.subscriptions.get(id) || {};
      const path = this.endpointPathfinder.find(nodeId, endpointId, direction);
      const servicePath = this.pathFinder.find(nodeId, direction);
      directionSubscriptions[direction] = fetchData(endpointId, path).subscribe(result =>
        processResult(result, servicePath)
      );
      this.subscriptions.set(id, directionSubscriptions);
    }
  }

  fetchIncomingDataForNodeId(id, getIncomingDataForNodeIdCallback) {
    const direction = 'incoming';
    this.setupSubscriptionIfAbsent(id, direction, getIncomingDataForNodeIdCallback, (nodeId, result, path) => {
      this.processServiceResult(nodeId, result, direction, path);
      this.requestLayout();
    });
  }

  fetchOutgoingDataForNodeId(id, getOutgoingDataForNodeIdCallback) {
    const direction = 'outgoing';
    this.setupSubscriptionIfAbsent(id, direction, getOutgoingDataForNodeIdCallback, (nodeId, result, path) => {
      this.processServiceResult(nodeId, result, direction, path);
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

  processServiceResult(nodeId, result, direction, path) {
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

    const nodes = (result.data || []).map(n => {
      return {
        id: this.toUid(n.service.id, path, direction),
        service: n.service,
        endpoint: n.endpoint,
        relatedNodesCount: n.relatedNodesCount,
        metrics: n.metrics
      };
    });

    for (let i = 0; i < nodes.length; i++) {
      const newNode = nodes[i];
      const serviceNode = currentNodes.has(newNode.id)
        ? currentNodes.get(newNode.id)
        : this.addNode(newNode.id, newNode.service, newNode.metrics);

      if (direction === 'incoming') {
        serviceNode.setIsExpanded(true, 'outgoing');
        if (newNode.relatedNodesCount === 0) {
          serviceNode.setIsExpanded(true, direction);
        }
      } else {
        serviceNode.setIsExpanded(true, 'incoming');
        if (newNode.relatedNodesCount === 0) {
          serviceNode.setIsExpanded(true, direction);
        }
      }
    }

    node.addConnected(nodes.map(n => n.id), direction);
  }

  processEndpointResult(nodeId, endpointId, result, direction, path) {
    const hasErrors = result.errors.length > 0;
    if (hasErrors) {
      return;
    }

    const isLoading = result.progress.loading;
    if (isLoading) {
      return;
    }

    const currentNodes = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator.getNodes();
    const node = currentNodes.get(nodeId);
    const child = node.children.get(endpointId);
    child.setIsExpanded(true, direction);

    const nodes = (result.data || []).map(n => {
      return {
        id: this.toUid(n.service.id, path, direction),
        service: n.service,
        endpoint: n.endpoint,
        relatedNodesCount: n.relatedNodesCount,
        metrics: n.metrics
      };
    });

    for (let i = 0; i < nodes.length; i++) {
      const newNode = nodes[i];
      const serviceNode = currentNodes.has(newNode.id)
        ? currentNodes.get(newNode.id)
        : this.addNode(newNode.id, newNode.service, newNode.metrics);

      const newChild = serviceNode.addChild(newNode.endpoint);

      if (direction === 'incoming') {
        serviceNode.setIsExpanded(true, 'outgoing');
        newChild.setIsExpanded(true, 'outgoing');
      } else {
        serviceNode.setIsExpanded(true, 'incoming');
        newChild.setIsExpanded(true, 'incoming');
      }

      child.addConnected(
        [
          {
            nodeId: newChild.nodeId,
            id: newChild.id
          }
        ],
        direction
      );

      node.addConnected([serviceNode.id], direction);
    }
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

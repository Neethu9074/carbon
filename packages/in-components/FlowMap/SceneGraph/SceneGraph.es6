import RoEmitter from 'roemitter';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
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

    this.initSubscriptions();
  }

  initSubscriptions() {
    this.layoutSubscription = this.signals
      .on('layout')
      .debounce(200)
      .subscribe(() => this.relayout());
  }

  addRootNode({ id, service, endpoint }) {
    this.rootNodeId = id;
    this.pathFinder.setRootNodeId(id);

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
    const node = new Node(this.serviceLocatorUid, id, data, metricValues);
    node.__originalId = data ? data.id : id;

    nodesServiceLocator.addNode(node.id, node);

    return node;
  }

  getFlowNodesForChild$(nodeId, endpointId, direction, callback) {
    const path = this.pathFinder.findChild(nodeId, endpointId, direction);
    this.setupSubscriptionIfAbsent(
      `${nodeId}__${endpointId}`,
      nodeId,
      endpointId,
      direction,
      () => callback(endpointId, path),
      this.processEndpointResult.bind(this)
    );
  }

  getFlowNodes$(nodeId, direction, callback) {
    this.setupSubscriptionIfAbsent(
      nodeId,
      nodeId,
      null,
      direction,
      servicePath => callback(nodeId, servicePath),
      this.processServiceResult.bind(this)
    );
  }

  setupSubscriptionIfAbsent(subscriptionId, nodeId, endpointId, direction, fetchData, processResult) {
    if (!this.containsSubscription(subscriptionId, direction)) {
      const currentNodes = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator.getNodes();
      const servicePath = this.pathFinder
        .find(nodeId, direction)
        .map(_nodeId => currentNodes.get(_nodeId).__originalId);

      const directionSubscriptions = this.subscriptions.get(subscriptionId) || {};
      directionSubscriptions[direction] = fetchData(servicePath).subscribe(result => {
        processResult(nodeId, endpointId, result, direction, servicePath);
        this.requestLayout();
      });
      this.subscriptions.set(subscriptionId, directionSubscriptions);
    }
  }

  containsSubscription(id, direction) {
    const directionSubscriptions = this.subscriptions.get(id);
    return directionSubscriptions && directionSubscriptions[direction] ? true : false;
  }

  processServiceResult(nodeId, endpointId, result, direction, path) {
    const onResult = (node, nodes, currentNodes) => {
      node.setIsLoadingData(false, direction);
      node.setIsExpanded(true, direction);
      for (let i = 0; i < nodes.length; i++) {
        const newNode = nodes[i];
        const serviceNode = currentNodes.has(newNode.id)
          ? currentNodes.get(newNode.id)
          : this.addNode(newNode.id, newNode.service, {});

        node.addConnected(serviceNode, direction);

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
    };

    const onError = node => node.setErrors(result.errors, direction);
    const onLoad = node => node.setIsLoadingData(true, direction);

    this.processResult(nodeId, result, onError, onLoad, onResult, direction, path);
  }

  processEndpointResult(nodeId, endpointId, result, direction, path) {
    const onResult = (node, nodes, currentNodes) => {
      const child = node.children.get(endpointId);
      child.setIsExpanded(true, direction);

      for (let i = 0; i < nodes.length; i++) {
        const newNode = nodes[i];
        const serviceNode = currentNodes.has(newNode.id)
          ? currentNodes.get(newNode.id)
          : this.addNode(newNode.id, newNode.service, newNode.metrics);

        node.addConnected(serviceNode, direction);

        const newChild = serviceNode.addChild(newNode.endpoint, newNode.metrics);

        if (direction === 'incoming') {
          serviceNode.setIsExpanded(true, 'outgoing');
          newChild.setIsExpanded(true, 'outgoing');
        } else {
          serviceNode.setIsExpanded(true, 'incoming');
          newChild.setIsExpanded(true, 'incoming');
        }

        child.addConnected(newChild, direction);
      }
    };

    const onError = () => {};
    const onLoad = () => {};

    this.processResult(nodeId, result, onError, onLoad, onResult, direction, path);
  }

  processResult(nodeId, result, onError, onLoading, onResult, direction, path) {
    const currentNodes = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator.getNodes();
    const node = currentNodes.get(nodeId);

    const hasErrors = result.errors.length > 0;
    onError(node, result.errors);
    if (hasErrors) {
      return;
    }

    const isLoading = result.progress.loading;
    onLoading(node);
    if (isLoading) {
      return;
    }

    const nodes = this.mapResult(result, path, direction);
    onResult(node, nodes, currentNodes);
  }

  mapResult(result, path, direction) {
    return (result.data || []).filter(node => node.service.id).map(n => {
      return {
        id: this.toUid(n.service.id, path, direction),
        service: n.service,
        endpoint: n.endpoint,
        relatedNodesCount: n.relatedNodesCount,
        metrics: n.metrics
      };
    });
  }

  toUid(id, previousNodesPath, direction) {
    let path;
    if (direction === 'incoming') {
      path = [id].concat(previousNodesPath);
    } else {
      path = previousNodesPath.concat([id]);
    }
    return path.join(`_${direction}_`);
  }

  requestLayout() {
    this.signals.emit('layout', true);
  }

  relayout() {
    const serviceLocators = getServiceLocators(this.serviceLocatorUid);
    const nodesMap = serviceLocators.nodesServiceLocator.getNodes();

    if (this.rootNodeId) {
      flowLayout(nodesMap.get(this.rootNodeId), serviceLocators.sceneServiceLocator.getScene().initialPxUnitRation);
    } else {
      looseLayout();
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

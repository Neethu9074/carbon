import RoEmitter from 'roemitter';

import RemainingNodesPlaceholder from 'in-components/FlowMap/sceneObjects/RemainingNodesPlaceholder';
import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import looseLayout from 'in-components/FlowMap/misc/layouting/looseLayouter';
import flowLayout from 'in-components/FlowMap/misc/layouting/flowLayouter';
import Node from 'in-components/FlowMap/sceneObjects/Node';

export default class SceneGraph {
  constructor(serviceLocatorUid) {
    this.serviceLocatorUid = serviceLocatorUid;
    this.signals = new RoEmitter('sceneGraphSignals');

    this.initSubscriptions();
  }

  initSubscriptions() {
    this.layoutSubscription = this.signals
      .on('layout')
      .debounce(200)
      .subscribe(() => this.relayout());
  }

  addNode(nodesServiceLocator, { id, __originalId }) {
    const node = new Node(this.serviceLocatorUid, id);
    node.__originalId = __originalId;

    nodesServiceLocator.addNode(node.id, node);

    return node;
  }

  updateState(nextFlowMapState) {
    this.rootNodeId = nextFlowMapState.getRootNodeId();

    this.createNewNodes(nextFlowMapState.nodes);

    // we have to iterate over all nodes twice because we first need to create all nodes until we can connect them by reference
    this.updateAllNodes(nextFlowMapState.nodes);

    this.requestLayout();
  }

  createNewNodes(nodes) {
    const nodesServiceLocator = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator;
    const currentNodes = nodesServiceLocator.getNodes();
    const nodesIterator = nodes.values();
    for (const node of nodesIterator) {
      let nodeSceneObject;
      if (!currentNodes.has(node.id)) {
        nodeSceneObject = this.addNode(nodesServiceLocator, node);
      } else {
        nodeSceneObject = currentNodes.get(node.id);
      }

      this.createRemainingNodesPlaceholderIfNeeded(node);
      nodeSceneObject.addChildren(node.children);
    }
  }

  createRemainingNodesPlaceholderIfNeeded(node) {
    const serviceLocatorUid = this.serviceLocatorUid;
    const nodesServiceLocator = getServiceLocators(serviceLocatorUid).nodesServiceLocator;
    const currentNodes = nodesServiceLocator.getNodes();

    const placeHolderIncomingNodeId = `${node.id}.incoming.remainingNodes`;
    if (node.paginationInformation.incoming && node.paginationInformation.incoming.numRemainingNodes > 0) {
      createRemainingNodesPlaceholderIfNeededForDirection(placeHolderIncomingNodeId, node, 'incoming');
    } else {
      checkIfNeedsDeletion(placeHolderIncomingNodeId);
    }

    const placeHolderOutgoingNodeId = `${node.id}.outgoing.remainingNodes`;
    if (node.paginationInformation.outgoing && node.paginationInformation.outgoing.numRemainingNodes > 0) {
      createRemainingNodesPlaceholderIfNeededForDirection(placeHolderOutgoingNodeId, node, 'outgoing');
    } else {
      checkIfNeedsDeletion(placeHolderOutgoingNodeId);
    }

    function checkIfNeedsDeletion(id) {
      if (currentNodes.has(id)) {
        nodesServiceLocator.removeNode(id);
        const connected = getServiceLocators(serviceLocatorUid).nodesServiceLocator.findConnected(id);
        if (connected) {
          node[connected.direction].splice(connected.index, 1);
        }
      }
    }

    function createRemainingNodesPlaceholderIfNeededForDirection(placeHolderNodeId, node, direction) {
      let nodeSceneObject;
      if (!currentNodes.has(placeHolderNodeId)) {
        nodeSceneObject = new RemainingNodesPlaceholder(serviceLocatorUid, placeHolderNodeId);
        nodesServiceLocator.addNode(nodeSceneObject.id, nodeSceneObject);
        node[direction].push(nodeSceneObject);
      } else {
        nodeSceneObject = currentNodes.get(placeHolderNodeId);
      }

      nodeSceneObject.setData({
        paginationInformation: node.paginationInformation[direction]
      });
    }
  }

  updateAllNodes(nodes) {
    const nodesServiceLocator = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator;
    const currentNodes = nodesServiceLocator.getNodes();

    const nodesIterator = nodes.values();
    for (const node of nodesIterator) {
      const nodeSceneObject = currentNodes.get(node.id);
      nodeSceneObject.setMetrics(node.metricValues);
      nodeSceneObject.setData(node.data);
      nodeSceneObject.setApplicationId(node.applicationId);

      const incomingDirection = 'incoming';
      nodeSceneObject.setConnected(node.incoming.map(_node => currentNodes.get(_node.id)), incomingDirection);
      nodeSceneObject.setIsExpanded(node.hasRelatedNodes.incoming == false, incomingDirection);
      nodeSceneObject.setErrors(node.errors.incoming, incomingDirection);
      nodeSceneObject.setIsLoadingData(node.isLoading.incoming, incomingDirection);

      const outgoingDirection = 'outgoing';
      nodeSceneObject.setConnected(node.outgoing.map(_node => currentNodes.get(_node.id)), outgoingDirection);
      nodeSceneObject.setIsExpanded(node.hasRelatedNodes.outgoing == false, outgoingDirection);
      nodeSceneObject.setErrors(node.errors.outgoing, outgoingDirection);
      nodeSceneObject.setIsLoadingData(node.isLoading.outgoing, outgoingDirection);

      this.updateChildConnections(currentNodes, nodeSceneObject, node);
    }
  }

  updateChildConnections(currentNodes, nodeSceneObject, node) {
    const childrenIterator = node.children.values();
    for (const child of childrenIterator) {
      const childSceneObject = nodeSceneObject.children.get(child.id);

      const incomingDirection = 'incoming';
      childSceneObject.setConnected(
        child.incoming.map(_child => currentNodes.get(_child.nodeId).children.get(_child.id)),
        incomingDirection
      );
      childSceneObject.setIsExpanded(child.hasRelatedNodes.incoming == false, incomingDirection);
      childSceneObject.setIsLoadingData(child.isLoading.incoming, incomingDirection);

      const outgoingDirection = 'outgoing';
      childSceneObject.setConnected(
        child.outgoing.map(_child => currentNodes.get(_child.nodeId).children.get(_child.id)),
        outgoingDirection
      );
      childSceneObject.setIsExpanded(child.hasRelatedNodes.outgoing == false, outgoingDirection);
      childSceneObject.setIsLoadingData(child.isLoading.outgoing, outgoingDirection);
    }
  }

  requestLayout() {
    this.signals.emit('layout', true);
  }

  relayout() {
    const serviceLocators = getServiceLocators(this.serviceLocatorUid);
    const currentNodes = serviceLocators.nodesServiceLocator.getNodes();

    if (this.rootNodeId) {
      flowLayout(currentNodes.get(this.rootNodeId), serviceLocators.sceneServiceLocator.getScene().initialPxUnitRation);
    } else {
      looseLayout();
    }

    this.updateConnections(currentNodes);

    getServiceLocators(this.serviceLocatorUid)
      .sceneServiceLocator.getScene()
      .requestRendering();
  }

  updateConnections(currentNodes) {
    getServiceLocators(this.serviceLocatorUid).connectionsServiceLocator.update(currentNodes);
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

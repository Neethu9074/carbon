/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import RoEmitter from '@instana/roemitter';

import RemainingNodesPlaceholder from 'in-applications/FlowMap/sceneObjects/RemainingNodesPlaceholder';
import { getServiceLocators } from 'in-applications/FlowMap/serviceLocator/serviceLocator';
import looseLayout from 'in-applications/FlowMap/misc/layouting/looseLayouter';
import flowLayout from 'in-applications/FlowMap/misc/layouting/flowLayouter';
import Node from 'in-applications/FlowMap/sceneObjects/Node';

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

    this.removeVanishedNodes(nextFlowMapState.nodes);
    this.createNewNodes(nextFlowMapState.nodes);

    // we have to iterate over all nodes twice because we first need to create all nodes until we can connect them by reference
    this.updateAllNodes(nextFlowMapState.nodes);

    this.requestLayout();
  }

  removeVanishedNodes(nodes) {
    const nodesServiceLocator = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator;
    const currentNodes = nodesServiceLocator.getNodes();
    const nodesIterator = currentNodes.objects.values();
    for (const node of nodesIterator) {
      if (!nodes.has(node.id)) {
        nodesServiceLocator.removeNode(node.id);
      }
    }
  }

  createNewNodes(nodes) {
    const nodesServiceLocator = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator;
    const currentNodes = nodesServiceLocator.getNodes();
    const nodesIterator = nodes.values();
    for (const node of nodesIterator) {
      let nodeSceneObject;
      if (currentNodes.has(node.id)) {
        nodeSceneObject = currentNodes.get(node.id);

        if (node.isRemainingNodesPlaceHolder) {
          nodeSceneObject.setPaginationInformation(node.paginationInformation);
        }
      } else if (node.isRemainingNodesPlaceHolder) {
        nodeSceneObject = new RemainingNodesPlaceholder(this.serviceLocatorUid, node.id);
        nodeSceneObject.setPaginationInformation(node.paginationInformation);
        nodesServiceLocator.addNode(node.id, nodeSceneObject);
      } else {
        nodeSceneObject = this.addNode(nodesServiceLocator, node);
      }

      nodeSceneObject.addChildren(node.children);
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
      nodeSceneObject.setConnected(mapToSceneObjectNodes(node.incoming), incomingDirection);
      nodeSceneObject.setIsExpanded(node.hasRelatedNodes.incoming == false, incomingDirection);
      nodeSceneObject.setErrors(node.errors.incoming, incomingDirection);
      nodeSceneObject.setIsLoadingData(node.isLoading.incoming, incomingDirection);

      const outgoingDirection = 'outgoing';
      nodeSceneObject.setConnected(mapToSceneObjectNodes(node.outgoing), outgoingDirection);
      nodeSceneObject.setIsExpanded(node.hasRelatedNodes.outgoing == false, outgoingDirection);
      nodeSceneObject.setErrors(node.errors.outgoing, outgoingDirection);
      nodeSceneObject.setIsLoadingData(node.isLoading.outgoing, outgoingDirection);

      this.updateChildConnections(currentNodes, nodeSceneObject, node);
    }

    function mapToSceneObjectNodes(nodes) {
      return nodes.map(_node => currentNodes.get(_node.id)).filter(n => n);
    }
  }

  updateChildConnections(currentNodes, nodeSceneObject, node) {
    const childrenIterator = node.children.values();
    for (const child of childrenIterator) {
      const childSceneObject = nodeSceneObject.children.get(child.id);

      const incomingDirection = 'incoming';
      childSceneObject.setConnected(mapToSceneObjectNodes(child.incoming), incomingDirection);
      childSceneObject.setIsExpanded(child.hasRelatedNodes.incoming == false, incomingDirection);
      childSceneObject.setIsLoadingData(child.isLoading.incoming, incomingDirection);

      const outgoingDirection = 'outgoing';
      childSceneObject.setConnected(mapToSceneObjectNodes(child.outgoing), outgoingDirection);
      childSceneObject.setIsExpanded(child.hasRelatedNodes.outgoing == false, outgoingDirection);
      childSceneObject.setIsLoadingData(child.isLoading.outgoing, outgoingDirection);
    }

    function mapToSceneObjectNodes(children) {
      return children
        .map(_child => {
          const node = currentNodes.get(_child.nodeId);
          if (!node) {
            return null;
          }
          return node.children.get(_child.id);
        })
        .filter(n => n);
    }
  }

  requestLayout() {
    this.signals.emit('layout', true);
  }

  relayout() {
    const serviceLocators = getServiceLocators(this.serviceLocatorUid);
    const currentNodes = serviceLocators.nodesServiceLocator.getNodes();

    if (this.rootNodeId) {
      flowLayout(currentNodes.get(this.rootNodeId));
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

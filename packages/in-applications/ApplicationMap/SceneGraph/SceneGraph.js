import { combineLatest } from '@instana/observables';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import concurrentLayouting from 'in-applications/ApplicationMap/misc/layouting/concurrentLayouting';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import forceLayout from 'in-applications/ApplicationMap/misc/layouting/FruchtermannReingold';
import flowLayout from 'in-applications/ApplicationMap/misc/layouting/Vizceral';
import Node from 'in-applications/ApplicationMap/sceneObjects/Node';

export default class SceneGraph {
  constructor(serviceLocatorUid) {
    this.serviceLocatorUid = serviceLocatorUid;
    this.nodePositionsCache = new Map();
  }

  initSubscriptions() {
    const eventBusServiceLocator = getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator;

    this.layoutSubscription = combineLatest([
      eventBusServiceLocator
        .on(SIGNALS.LAYOUTER)
        .distinct()
        .tap(() => this.nodePositionsCache.clear()),
      // a layout can only be processed properly if the size was set at least once.
      // since we dont want to relayout on resize, map it to "true" and distinct the stream
      eventBusServiceLocator
        .on(SIGNALS.RESIZE)
        .map(() => true)
        .distinct(),
      eventBusServiceLocator.on(SIGNALS.STATE_UPDATED)
    ])
      .nextFrame()
      .subscribe(([layouter]) => this.relayout(layouter));
  }

  addNode(nodesServiceLocator, { id }) {
    const node = new Node(this.serviceLocatorUid, id);
    nodesServiceLocator.addNode(node.id, node);
    return node;
  }

  updateState(nextState, incomingConnectionsMap) {
    this.removeVanishedNodes(nextState.services);
    this.createNewNodes(nextState.services);

    // we have to iterate over all nodes twice because we first need to create all nodes until we can connect them by reference
    this.updateAllNodes(nextState, incomingConnectionsMap);

    const nodesServiceLocator = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator;
    const currentNodes = nodesServiceLocator.getNodes();
    this.updateConnections(currentNodes);
  }

  removeVanishedNodes(nodes) {
    const nodeIds = {};
    for (let i = 0; i < nodes.length; i++) {
      nodeIds[nodes[i].id] = true;
    }

    const nodesServiceLocator = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator;
    const currentNodes = nodesServiceLocator.getNodes();
    const nodesIterator = currentNodes.objects.values();
    for (const node of nodesIterator) {
      if (!nodeIds[node.id]) {
        nodesServiceLocator.removeNode(node.id);
      }
    }
  }

  createNewNodes(nodes) {
    const nodesServiceLocator = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator;
    const currentNodes = nodesServiceLocator.getNodes();

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (!currentNodes.has(node.id)) {
        this.addNode(nodesServiceLocator, node);
      }
    }
  }

  updateAllNodes({ services }, incomingConnectionsMap) {
    const nodesServiceLocator = getServiceLocators(this.serviceLocatorUid).nodesServiceLocator;
    const currentNodes = nodesServiceLocator.getNodes();

    for (let i = 0; i < services.length; i++) {
      const node = services[i];
      const nodeSceneObject = currentNodes.get(node.id);
      const incomingConnections = incomingConnectionsMap.get(node.id) || [];

      nodeSceneObject.setData(node);
      nodeSceneObject.setIncoming(incomingConnections);
    }
  }

  updateConnections(currentNodes) {
    getServiceLocators(this.serviceLocatorUid).connectionsServiceLocator.update(currentNodes);
  }

  requestLayout() {
    const eventBusServiceLocator = getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator;
    eventBusServiceLocator
      .on(SIGNALS.LAYOUTER)
      .once(layouter => eventBusServiceLocator.emit(SIGNALS.LAYOUTER, layouter));
  }

  relayout(layouter) {
    const serviceLocators = getServiceLocators(this.serviceLocatorUid);
    const currentNodes = serviceLocators.nodesServiceLocator.getNodes().objects;
    const currentEdges = serviceLocators.connectionsServiceLocator.getConnections();

    serviceLocators.eventBusServiceLocator.emit(SIGNALS.IS_LAYOUTING, true);
    concurrentLayouting.call(
      layouter,
      {
        nodes: currentNodes,
        edges: currentEdges,
        positionsMap: this.nodePositionsCache
      },
      result => {
        this.applyResult(currentNodes, result);
        serviceLocators.connectionsServiceLocator.updateAllConnectionPositions();
        serviceLocators.eventBusServiceLocator.emit(SIGNALS.IS_LAYOUTING, false);
        serviceLocators.eventBusServiceLocator.emit(SIGNALS.LAYOUT, {
          currentNodes,
          layouter: result.usedLayouter === 'flow' ? flowLayout : forceLayout
        });
        serviceLocators.sceneServiceLocator.getScene().requestRendering();
      }
    );
  }

  applyResult(currentNodes, result) {
    const nodes = currentNodes.values();
    for (const node of nodes) {
      const layoutedNode = result.data.nodes.get(node.id);
      if (layoutedNode) {
        node.setPosition(layoutedNode.x, layoutedNode.y);
      }
    }
  }

  dispose() {
    concurrentLayouting.disposeRunning();

    if (this.layoutSubscription) {
      this.layoutSubscription.dispose();
      this.layoutSubscription = null;
    }

    this.nodePositionsCache.clear();
    this.nodePositionsCache = null;
    this.serviceLocatorUid = null;
    this.data = null;
  }
}

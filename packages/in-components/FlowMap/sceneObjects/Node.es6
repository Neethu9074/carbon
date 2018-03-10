import { combineLatest } from 'reactive-observables';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import FlowMapBaseEntity from 'in-components/FlowMap/sceneObjects/FlowMapBaseEntity';
import Child from 'in-components/FlowMap/sceneObjects/Child';
import { find } from 'in-services/arrayUtils';

// 0.1, because we want to give the calculation a bit of space (10%) until the screenposition is invalid
const leftBoundary = -0.1;
const rightBoundary = 1.1;
const topBoundary = -0.1;
const bottomBoundary = 1.1;

export default class Node extends FlowMapBaseEntity {
  constructor(serviceLocatorUid, id, data, metricValues) {
    super(serviceLocatorUid, id, metricValues);

    this.screenPosition = null;
    this.children = new Map();

    this.events$.emit('isExpanded_incoming', false);
    this.events$.emit('isExpanded_outgoing', false);

    this.setData(data);
    this.initSubscriptions(metricValues, data);
  }

  initSubscriptions(metricValues, data) {
    super.initSubscriptions(metricValues);

    this.subscriber.addSubscription(
      combineLatest([
        getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.on('cameraUpdate'),
        this.events$.on('transform')
      ]).subscribe(() => this.updateScreenPosition())
    );

    if (!data) {
      this.subscriber.addSubscription(
        getServiceLocators(this.serviceLocatorUid)
          .dataFetchingServiceLocator.getNode$(this.id)
          .map(this.mapResult)
          .subscribe(data => this.events$.emit('data', data))
      );
    }
  }

  updateScreenPosition() {
    const sceneServiceLocator = getServiceLocators(this.serviceLocatorUid).sceneServiceLocator;
    const scene = sceneServiceLocator.getScene();

    const screenPosition = this.position.clone();
    screenPosition.applyMatrix4(scene.camera.getRenderableCamera().projection);

    screenPosition.x = (screenPosition.x + 1) / 2;
    screenPosition.y = -(screenPosition.y - 1) / 2;

    if (
      screenPosition.x > leftBoundary &&
      screenPosition.x < rightBoundary &&
      screenPosition.y > topBoundary &&
      screenPosition.y < bottomBoundary
    ) {
      screenPosition.x *= scene.camera.width;
      screenPosition.y *= scene.camera.height;
      this.events$.emit('screenPosition', screenPosition);
      this.screenPosition = screenPosition;
    } else {
      if (this.screenPosition != null) {
        this.screenPosition = null;
        this.events$.emit('screenPosition', null);
      }
    }
  }

  addChild(child, metrics) {
    if (this.children.has(child.id)) {
      return this.children.get(child.id);
    }

    const newChild = new Child(this, child.id, metrics);
    newChild.setData(child);

    this.children.set(child.id, newChild);
    this.events$.emit('children', this.children);

    return newChild;
  }

  addConnected(item, direction) {
    const contains = find(this[direction], _item => _item.id === item.id);
    if (!contains) {
      this[direction].push(item);
      this.setIsExpanded(true, direction);
    }
  }

  expandRight() {
    getServiceLocators(this.serviceLocatorUid).dataFetchingServiceLocator.getOutgoingFlowNodes$(this.id);
  }

  expandLeft() {
    getServiceLocators(this.serviceLocatorUid).dataFetchingServiceLocator.getIncomingFlowNodes$(this.id);
  }

  dispose() {
    const serviceLocators = getServiceLocators(this.serviceLocatorUid);
    serviceLocators.nodesServiceLocator.removeNode(this.id, this);

    super.dispose();
  }
}

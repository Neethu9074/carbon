import { combineLatest } from 'reactive-observables';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import FlowMapBaseEntity from 'in-components/FlowMap/sceneObjects/FlowMapBaseEntity';
import Child from 'in-components/FlowMap/sceneObjects/Child';

// 0.1, because we want to give the calculation a bit of space (10%) until the screenposition is invalid
const leftBoundary = -0.1;
const rightBoundary = 1.1;
const topBoundary = -0.1;
const bottomBoundary = 1.1;

export default class Node extends FlowMapBaseEntity {
  constructor(serviceLocatorUid, id) {
    super(serviceLocatorUid, id);

    this.screenPosition = null;
    this.children = new Map();

    this.events$.emit('isExpanded_incoming', false);
    this.events$.emit('isExpanded_outgoing', false);

    this.initSubscriptions();
  }

  initSubscriptions() {
    super.initSubscriptions();

    this.subscriber.addSubscription(
      combineLatest([
        getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.on('cameraUpdate'),
        this.events$.on('transform')
      ]).subscribe(() => this.updateScreenPosition())
    );
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

  addChildren(children) {
    let childrenChanged = false;
    const childrenIterator = children.values();
    for (const child of childrenIterator) {
      if (!this.children.has(child.id)) {
        const newChildSceneObject = new Child(this, child.id);
        newChildSceneObject.setMetrics(child.metricValues);
        newChildSceneObject.setData(child.data);

        this.children.set(child.id, newChildSceneObject);
        childrenChanged = true;
      }
    }

    if (childrenChanged) {
      this.events$.emit('children', this.children);
    }
  }

  dispose() {
    const serviceLocators = getServiceLocators(this.serviceLocatorUid);
    serviceLocators.nodesServiceLocator.removeNode(this.id, this);

    super.dispose();
  }
}

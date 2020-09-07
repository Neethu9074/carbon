import { combineLatest } from 'reactive-observables';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import FlowMapBaseEntity from 'in-components/FlowMap/sceneObjects/FlowMapBaseEntity';
import Child from 'in-components/FlowMap/sceneObjects/Child';

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

    screenPosition.x *= scene.camera.width;
    screenPosition.y *= scene.camera.height;
    this.events$.emit('screenPosition', screenPosition);
    this.screenPosition = screenPosition;
  }

  addChildren(children) {
    let childrenChanged = !children;

    if (children) {
      const childrenIterator = children.values();
      for (const child of childrenIterator) {
        if (this.addChild(child)) {
          childrenChanged = true;
        }
      }
    }

    if (childrenChanged) {
      this.events$.emit('children', this.children);
    }
  }

  addChild(child) {
    if (!this.children.has(child.id)) {
      const newChildSceneObject = new Child(this, child.id);
      newChildSceneObject.setMetrics(child.metricValues);
      newChildSceneObject.setData(child.data);

      this.children.set(child.id, newChildSceneObject);
      return newChildSceneObject;
    }
  }

  findConnectedChild(childId) {
    const children = this.children;
    function find(direction) {
      const childIterator = children.values();
      for (const otherChild of childIterator) {
        for (let iConnected = 0; iConnected < otherChild[direction].length; iConnected++) {
          const connectedChild = otherChild[direction][iConnected];
          if (connectedChild.id === childId) {
            return { child: otherChild, index: iConnected, direction };
          }
        }
      }
    }

    return find('incoming') || find('outgoing');
  }

  dispose() {
    const serviceLocators = getServiceLocators(this.serviceLocatorUid);
    serviceLocators.nodesServiceLocator.removeNode(this.id, this);

    super.dispose();
  }
}

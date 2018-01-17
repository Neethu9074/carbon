import { combineLatest } from 'reactive-observables';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import SceneObject from 'in-components/FlowMap/sceneObjects/SceneObject';
import Subscriber from 'in-map/misc/Subscriber';

export default class Node extends SceneObject {
  constructor(serviceLocatorUid, object) {
    super(object.id, serviceLocatorUid);

    this.screenPosition = this.position;

    const serviceLocators = getServiceLocators(serviceLocatorUid);
    serviceLocators.nodesServiceLocator.addNode(this.id, this);

    this.initSubscriptions();
  }

  initSubscriptions() {
    this.subscriber = new Subscriber();
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

    this.screenPosition = screenPosition;
    this.events$.emit('screenPosition', screenPosition);
  }

  disposeSubscriptions() {
    this.subscriber.dispose();
    this.subscriber = null;
  }

  dispose() {
    this.disposeSubscriptions();

    const serviceLocators = getServiceLocators(this.serviceLocatorUid);
    serviceLocators.nodesServiceLocator.removeNode(this.id, this);

    super.dispose();
  }
}

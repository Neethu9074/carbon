/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest } from '@instana/observables';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import SceneObject from 'in-applications/ApplicationMap/sceneObjects/SceneObject';
import Subscriber from 'in-map/misc/Subscriber';

// 0.1, because we want to give the calculation a bit of space (10%) until the screenposition is invalid
const leftBoundary = -0.1;
const rightBoundary = 1.1;
const topBoundary = -0.1;
const bottomBoundary = 1.1;

export default class Node extends SceneObject {
  constructor(serviceLocatorUid, id) {
    super(id, serviceLocatorUid);

    this.subscriber = new Subscriber();
    this.screenPosition = null;
    this.incoming = [];

    this.initSubscriptions();
  }

  initSubscriptions() {
    this.subscriber.addSubscription(
      combineLatest([
        getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.on(SIGNALS.CAMERA_UPDATE),
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

  setIncoming(items) {
    this.incoming = items;
  }

  setData(data) {
    this.data = data;
  }

  dispose() {
    const serviceLocators = getServiceLocators(this.serviceLocatorUid);
    serviceLocators.nodesServiceLocator.removeNode(this.id, this);

    this.subscriber.dispose();
    this.subscriber = null;

    super.dispose();

    this.outgoing = null;
    this.incoming = null;
    this.data = null;
  }
}

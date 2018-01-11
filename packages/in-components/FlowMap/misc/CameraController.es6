import Hammer from 'hammerjs';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';

export default class CameraController {
  constructor(serviceLocatorUid, camera, overlayDomElement) {
    this.serviceLocatorUid = serviceLocatorUid;
    this.camera = camera;
    this.overlayDomElement = overlayDomElement;

    this.targetCameraSize = 30;
    this.minZoomLevel = 1;
    this.maxZoomLevel = 10000;
    this.cameraMoveSpeed = 4;

    // holds the mouse/touch position in pixel coordinates
    this.cursor = { x: 0, y: 0 };

    this.scene = getServiceLocators(this.serviceLocatorUid).sceneServiceLocator.getScene();

    camera.setCameraSize(this.targetCameraSize);
    this.setPosition(0, 0);

    this.initSubscriptions();
  }

  initSubscriptions() {
    const update = this.update.bind(this);
    this.updateSubscription = getServiceLocators(this.serviceLocatorUid)
      .eventBusServiceLocator.on('update')
      .subscribe(update);

    const eventHandler = (this.eventHandler = new Hammer(this.overlayDomElement));
    eventHandler.on('panstart', this.onPanStart.bind(this));
    eventHandler.get('pan').set({
      direction: Hammer.DIRECTION_ALL,
      threshold: 5 // in px
    });
    eventHandler.on('pan', this.onPan.bind(this));
  }

  onPan(event) {
    const pointer = event.pointers[0];
    const speed = 0.0175;
    const dx = -speed * (pointer.clientX - this.cursor.x);
    const dy = speed * (pointer.clientY - this.cursor.y);

    const currentPosition = this.camera.getPosition();
    this.setPosition(currentPosition.x + dx, currentPosition.y + dy);

    this.cursor.x = pointer.clientX;
    this.cursor.y = pointer.clientY;

    this.scene.requestRendering();
  }

  onPanStart(event) {
    const pointer = event.pointers[0];
    this.cursor.x = pointer.clientX;
    this.cursor.y = pointer.clientY;
  }

  setPosition(x, y) {
    this.camera.setPosition(x, y);
    this.camera.update();
  }

  zoomIn(units) {
    this.targetCameraSize = Math.max(this.minZoomLevel, this.targetCameraSize - units);
  }

  zoomOut(units) {
    this.targetCameraSize = Math.min(this.maxZoomLevel, this.targetCameraSize + units);
  }

  update(dt) {
    const currentCameraSize = this.camera.getCameraSize();
    const targetCameraSize = this.targetCameraSize;
    const deltaSizes = targetCameraSize - currentCameraSize;

    let cameraNeedsUpdate = false;

    // stop at some point to avoid unlimited updates caused by very small changes users can't see
    if (Math.abs(deltaSizes) > 0.1) {
      const step = deltaSizes * dt * this.cameraMoveSpeed;
      this.camera.setCameraSize(currentCameraSize + step);
      cameraNeedsUpdate = true;
    }

    if (cameraNeedsUpdate) {
      this.camera.update();
      this.scene.requestRendering();
    }
  }

  disposeSubscriptions() {
    this.eventHandler.destroy();
    this.eventHandler = null;

    this.updateSubscription.dispose();
    this.updateSubscription = null;
  }

  dispose() {
    this.disposeSubscriptions();

    this.overlayDomElement = null;
    this.cursor = null;
    this.camera = null;
  }
}

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import Hammer from 'hammerjs';

import { getServiceLocators } from 'in-applications/FlowMap/serviceLocator/serviceLocator';
import { onWheel } from 'in-services/util/reactiveMouseEvents';
import Subscriber from 'in-map/misc/Subscriber';

export default class CameraController {
  constructor(serviceLocatorUid, camera, overlayDomElement) {
    this.serviceLocatorUid = serviceLocatorUid;
    this.camera = camera;
    this.overlayDomElement = overlayDomElement;

    this.unitsToZoomPerCall = 5;
    this.targetCameraSize = 55;
    this.minZoomLevel = 15;
    this.maxZoomLevel = 180;
    this.cameraMoveSpeed = 4;

    // holds the mouse/touch position in pixel coordinates
    this.cursor = { x: 0, y: 0 };

    this.scene = getServiceLocators(this.serviceLocatorUid).sceneServiceLocator.getScene();

    camera.setCameraSize(this.targetCameraSize);
    this.setPosition(0, 0);

    this.initSubscriptions();
  }

  initSubscriptions() {
    this.subscriber = new Subscriber();
    const update = this.update.bind(this);

    this.subscriber.addSubscription(
      getServiceLocators(this.serviceLocatorUid)
        .eventBusServiceLocator.on('update')
        .subscribe(update)
    );

    this.addPanSupport();
    this.addScrollSupport();
  }

  addPanSupport() {
    const eventHandler = (this.eventHandler = new Hammer(this.overlayDomElement));
    eventHandler.on('panstart', this.onPanStart.bind(this));
    eventHandler.get('pan').set({
      direction: Hammer.DIRECTION_ALL,
      threshold: 5 // in px
    });
    eventHandler.on('pan', this.onPan.bind(this));
  }

  addScrollSupport() {
    this.subscriber.addSubscription(
      onWheel(this.overlayDomElement, event => {
        // Because we listen to onwheel, the e.deltaY "should be" in a range of
        // +/- 0 .. 200, but sometimes is much larger due to "buffering" of scroll
        // events. Our map prefers values in the range of
        // +/- 0 .. 50. Because we cannot prevent buffering (browser seems not to)
        // react to user scroll, we at least prevent zooming way to much by capping
        // the value.

        // Touchy devices tend to send more frequent smaller scrolls, while "old"
        // mice send stable large ticks.

        // we erased the browsers deltaY completely, because it is to dynamic across all browsers / OS.
        // the only thing we extract is the scroll direction. To get the same feeling as before, a factor
        // is multiplied (15 here) which was found heuristically.
        this.zoom(3 * event.scrollSpeed * event.scrollDirection);
      })
    );
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

  zoomInOneStep() {
    this.zoom(-this.unitsToZoomPerCall);
  }

  zoomOutOneStep() {
    this.zoom(this.unitsToZoomPerCall);
  }

  zoom(units) {
    this.targetCameraSize = Math.max(this.minZoomLevel, Math.min(this.maxZoomLevel, this.targetCameraSize + units));
  }

  update(dt) {
    const currentCameraSize = this.camera.getCameraSize();
    const targetCameraSize = this.targetCameraSize;
    const deltaSizes = targetCameraSize - currentCameraSize;

    let cameraNeedsUpdate = false;

    // stop at some point to avoid unlimited updates caused by very small changes users can't see
    if (Math.abs(deltaSizes) > 0.1) {
      const step = deltaSizes * dt * this.cameraMoveSpeed;
      const newSize = currentCameraSize + step;
      this.camera.setCameraSize(newSize);
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

    this.subscriber.dispose();
    this.subscriber = null;
  }

  dispose() {
    this.disposeSubscriptions();

    this.overlayDomElement = null;
    this.cursor = null;
    this.camera = null;
  }
}

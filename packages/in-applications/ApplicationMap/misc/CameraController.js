/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import Hammer from 'hammerjs';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import { onWheel } from 'in-services/util/reactiveMouseEvents';
import Subscriber from 'in-map/misc/Subscriber';

export default class CameraController {
  constructor(serviceLocatorUid, camera, overlayDomElement) {
    this.serviceLocatorUid = serviceLocatorUid;
    this.camera = camera;
    this.overlayDomElement = overlayDomElement;

    this.unitsToZoomPerCall = 15;
    this.scrollSpeed = 5;
    this.targetCameraSize = 60;
    this.minZoomLevel = 30;
    this.maxZoomLevel = 300;
    this.cameraZoomSpeed = 8;
    this.unitsPerPixel = 0.03; // heuristic initial value
    this.isHoveringConnection = false;

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
    const updatePanningSpeed = this.updatePanningSpeed.bind(this);
    const setToMapCentralPositionAndAdaptZoom = this.setToMapCentralPositionAndAdaptZoom.bind(this);
    const eventBusServiceLocator = getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator;

    this.subscriber.addSubscriptions([
      eventBusServiceLocator.on(SIGNALS.UPDATE).subscribe(update),
      eventBusServiceLocator
        .on(SIGNALS.LAYOUT)
        .distinct((a, b) => a.layouter !== b.layouter)
        .subscribe(setToMapCentralPositionAndAdaptZoom),

      eventBusServiceLocator.on(SIGNALS.WORLD_UNITS).subscribe(updatePanningSpeed),

      getServiceLocators(this.serviceLocatorUid)
        .hoveredConncetionsServiceLocator.getHoveredConnection$()
        .subscribe(isHoveringConnection => {
          this.overlayDomElement.style.cursor = isHoveringConnection ? 'pointer' : 'auto';
          this.isHoveringConnection = isHoveringConnection;
        })
    ]);

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
    eventHandler.on('tap', this.onTab.bind(this));
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
        this.zoom(this.scrollSpeed * event.scrollSpeed * event.scrollDirection);
      })
    );
  }

  onPan(event) {
    const pointer = event.pointers[0];
    const speed = this.unitsPerPixel;
    const dx = -speed * (pointer.clientX - this.cursor.x);
    const dy = speed * (pointer.clientY - this.cursor.y);

    const currentPosition = this.camera.getPosition();
    this.setPosition(currentPosition.x + dx, currentPosition.y + dy);

    this.cursor.x = pointer.clientX;
    this.cursor.y = pointer.clientY;

    this.scene.requestRendering();
  }

  onTab() {
    if (this.isHoveringConnection) {
      getServiceLocators(this.serviceLocatorUid).hoveredConncetionsServiceLocator.setClickedConnection(
        this.isHoveringConnection
      );
    }
    getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.emit(SIGNALS.CLICKED, true);
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
    this.setTargetCameraSize(this.targetCameraSize + units);
  }

  setTargetCameraSize(size) {
    this.targetCameraSize = Math.max(this.minZoomLevel, Math.min(this.maxZoomLevel, size));
  }

  update(dt) {
    const currentCameraSize = this.camera.getCameraSize();
    const targetCameraSize = this.targetCameraSize;
    const deltaSizes = targetCameraSize - currentCameraSize;

    let cameraNeedsUpdate = false;

    // stop at some point to avoid unlimited updates caused by very small changes users can't see
    if (Math.abs(deltaSizes) > 0.1) {
      const step = deltaSizes * dt * this.cameraZoomSpeed;
      const newSize = currentCameraSize + step;
      this.camera.setCameraSize(newSize);
      cameraNeedsUpdate = true;
    }

    if (cameraNeedsUpdate) {
      this.camera.update();
      this.scene.requestRendering();
    }
  }

  updatePanningSpeed(worldUnits) {
    this.unitsPerPixel = worldUnits.unitsPerPixel;
  }

  setToMapCentralPositionAndAdaptZoom({ currentNodes, layouter }) {
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = -Number.MAX_VALUE;
    let maxY = -Number.MAX_VALUE;

    const nodes = currentNodes.values();
    for (const node of nodes) {
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x);
      maxY = Math.max(maxY, node.position.y);
    }

    const width = maxX - minX;
    const height = maxY - minY;
    const aspectRatio = this.getCurrentAspectRatio();

    this.adaptZoom(width, height, aspectRatio);

    const position = layouter.getCameraPositionByDimensions({
      targetCameraSize: this.targetCameraSize,
      aspectRatio,
      minX,
      maxX,
      minY,
      maxY
    });
    this.setPosition(position.x, position.y);
  }

  adaptZoom(width, height, aspectRatio) {
    const targetCameraSize = Math.max(width, height * aspectRatio);

    const marginInUnits = targetCameraSize * 0.3;
    const newTargetCameraSize = targetCameraSize + marginInUnits;

    this.setTargetCameraSize(newTargetCameraSize);
  }

  getCurrentAspectRatio() {
    return this.camera.width / this.camera.height || 1;
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

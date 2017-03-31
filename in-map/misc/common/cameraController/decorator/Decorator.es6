import { createLogger } from 'instalog';

const logger = createLogger('camera controller decorator');

export default class Decorator {
  constructor(inner) {
    this.eventEmitter = inner.eventEmitter;
    this.inner = inner;
    this.cameraController = this.getCameraController();
  }

  addProperty(name, value) {
    if (this.cameraController[name]) {
      logger.warn(name, 'is already defined on cameraController. It will be overriden!');
    }
    this.cameraController[name] = value;
  }

  init() {
    this.inner.init();
  }

  initEvents() {
    this.inner.initEvents();
  }

  addSubscriptions(subscriptions) {
    this.inner.addSubscriptions(subscriptions);
  }

  addSubscription(subscription) {
    this.inner.addSubscription(subscription);
  }

  flyToPosition(position) {
    this.inner.flyToPosition(position);
  }

  focusMap() {
    this.inner.focusMap();
  }

  clampCameraPositionToVerticesDimensions() {
    this.inner.clampCameraPositionToVerticesDimensions();
  }

  getRenderableCamera() {
    return this.inner.getRenderableCamera();
  }

  zoom(dt, centeredZoom) {
    this.inner.zoom(dt, centeredZoom);
  }

  update(dt) {
    this.inner.update(dt);
  }

  getCameraController() {
    return this.inner.getCameraController();
  }

  dispose() {
    this.inner.dispose();
    this.inner = null;

    this.cameraController = null;
  }
}

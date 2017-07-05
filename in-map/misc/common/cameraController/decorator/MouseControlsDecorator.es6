import { ZOOM_SPEED, INIT_ZOOM_LEVEL, MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL } from 'in-map/misc/CameraConfig';
import Decorator from 'in-map/misc/common/cameraController/decorator/Decorator';
import { onWheel, onMove } from 'in-services/util/reactiveMouseEvents';
import { requestRendering } from 'in-map/stores/renderingStore';
import { width, height } from 'in-map/stores/indexStore';
import { eventBus } from 'in-map/services/eventBus';

function weightZoom(zoomLevel) {
  const zoomLevelNormalized = (zoomLevel - MIN_ZOOM_LEVEL) / (MAX_ZOOM_LEVEL - MIN_ZOOM_LEVEL);
  const x = zoomLevelNormalized;
  const x2 = x * x;
  const x3 = x2 * x;

  // return a weighting in interval = [0, 1]. return higher values on higher zoom levels and only smaller values if
  // the zoomlevel gets really slow so we have small steps at the end and bigger steps on the overview
  return 2.245543004 * x3 - 4.609673881 * x2 + 3.256126918 * x + 0.1261846352;
}

export default class MouseControlDecorator extends Decorator {
  constructor(controller, canvas) {
    super(controller);

    this.canvas = canvas;

    // units / sec
    this.zoomSpeed = ZOOM_SPEED;

    // if the cam is nearly at the target zoomLevel, abort calculations and with that, redraws
    this.minDistanceBetweenCurrentAndTargetZoomLevel = 0.01;

    this.zoomLevel = 0;
    this.addProperty('zoomLevel', 0);
    this.addProperty('minZoomLevel', MIN_ZOOM_LEVEL);
    this.addProperty('maxZoomLevel', MAX_ZOOM_LEVEL);
    this.addProperty('cursorPosition', { x: 0, y: 0 });
    this.addProperty('screenSpaceCursorPosition', { x: 0, y: 0 });
    this.addProperty('setZoomLevel', this.setZoomLevel.bind(this));
    this.addProperty('setZoomLevelAbsolute', this.setZoomLevelAbsolute.bind(this));
  }

  init() {
    super.init();

    this.setZoomLevelAbsolute(INIT_ZOOM_LEVEL);
  }

  initEvents() {
    super.initEvents();

    const domElement = this.canvas;

    this.addSubscriptions([
      onMove(domElement, e => {
        e.preventDefault();

        this.setCursorPosition(e.offsetX, e.offsetY);
      }),
      onWheel(domElement, event => {
        const deltaY = event.rawEvent.deltaY;

        // Because we listen to onwheel, the e.deltaY "should be" in a range of
        // +/- 0 .. 200, but sometimes is much larger due to "buffering" of scroll
        // events. Our map prefers values in the range of
        // +/- 0 .. 50. Because we cannot prevent buffering (browser seems not to)
        // react to user scroll, we at least prevent zooming way to much by capping
        // the value.

        // Touchy devices tend to send more frequent smaller scrolls, while "old"
        // mice send stable large ticks.
        const delta = Math.max(-50, Math.min(50, (deltaY | 0) / 4));
        this.zoom(delta * event.scrollSpeed * event.scrollDirection);
      })
    ]);
  }

  zoom(delta, centeredZoom) {
    if (centeredZoom) {
      this.setCursorPosition(width / 2, height / 2);
    }

    this.zoomLevel = this.clampZoomLevel(this.zoomLevel + delta);
  }

  zoomIn() {
    const weight = weightZoom(this.zoomLevel);
    this.zoom(-100 * weight, true);
  }

  zoomOut() {
    const weight = weightZoom(this.zoomLevel);
    this.zoom(100 * weight, true);
  }

  setZoomLevel(zoomLevel) {
    const cameraController = this.getCameraController();
    const cameraWrapper = cameraController.camera;
    const camera = cameraWrapper.getRenderableCamera();
    camera.position.setZ(zoomLevel);

    cameraWrapper.setCameraSize(zoomLevel / 10);
    cameraWrapper.updateCameraFromSize();

    camera.updateMatrix();
    cameraWrapper.update();

    this.cameraController.zoomLevel = zoomLevel;
    eventBus.emit('zoomLevelChanged', zoomLevel);
    requestRendering();
  }

  setZoomLevelAbsolute(zoomLevel) {
    zoomLevel = this.clampZoomLevel(zoomLevel);

    this.zoomLevel = zoomLevel;
    this.setZoomLevel(zoomLevel);
  }

  clampZoomLevel(zoomLevel) {
    return Math.max(this.cameraController.minZoomLevel, Math.min(this.cameraController.maxZoomLevel, zoomLevel));
  }

  setCursorPosition(x, y) {
    const cursorPosition = this.cameraController.cursorPosition;

    if (cursorPosition.x === x && cursorPosition.y === y) {
      return;
    }
    cursorPosition.x = x;
    cursorPosition.y = y;

    // transform into screen space
    const screenSpaceCursorPosition = this.cameraController.screenSpaceCursorPosition;
    screenSpaceCursorPosition.x = x / width * 2 - 1;
    screenSpaceCursorPosition.y = -(y / height) * 2 + 1;

    this.eventEmitter.emit('onMouseMoved', cursorPosition);
  }

  update(dt) {
    super.update(dt);

    const deltaZoomLevel = this.zoomLevel - this.cameraController.zoomLevel;
    if (Math.abs(deltaZoomLevel) <= this.minDistanceBetweenCurrentAndTargetZoomLevel) {
      return;
    }

    // get the position of the point in world space where the mouse is pointing at and before the camera zoomed in
    const lastPointOfImpact = this.cameraController.getPointOfImpact();

    this.setZoomLevel(this.cameraController.zoomLevel + deltaZoomLevel * dt * this.zoomSpeed);

    if (!lastPointOfImpact) {
      return;
    }

    // get the new screenPosition of the impact point so that you can calculate the delta in screen space
    const pointOfImpact = this.cameraController.getPointOfImpact();
    if (!pointOfImpact) {
      return;
    }
    const dx = lastPointOfImpact.x - pointOfImpact.x;
    const dz = lastPointOfImpact.z - pointOfImpact.z;
    this.cameraController.moveAbsolute(dx, dz);
  }

  dispose() {
    super.dispose();

    this.canvas = null;
    this.zoomSpeed = null;
  }
}

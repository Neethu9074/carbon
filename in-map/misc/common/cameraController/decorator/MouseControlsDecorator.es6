import Decorator from 'in-map/misc/common/cameraController/decorator/Decorator';
import {onWheel, onMove} from 'in-services/reactiveMouseEvents';
import {requestRendering} from 'in-map/stores/renderingStore';
import {width, height} from 'in-map/stores/indexStore';
import {eventBus} from 'in-map/services/eventBus';


export default class MouseControlDecorator extends Decorator {

  constructor(controller, canvas, zoomLevelStore) {
    super(controller);

    this.canvas = canvas;

    // units / sec
    this.zoomSpeed = 10;

    this.zoomLevelStore = zoomLevelStore;

    // if the cam is nearly at the target zoomLevel, abort calculations and with that, redraws
    this.minDistanceBetweenCurrentAndTargetZoomLevel = 0.01;

    this.zoomLevel = zoomLevelStore.getZoomLevel() || 500;

    this.addProperty('zoomLevel', this.zoomLevel);
    this.addProperty('minZoomLevel', 20);
    this.addProperty('maxZoomLevel', 2000);
    this.addProperty('cursorPosition', {x: 0, y: 0});
    this.addProperty('screenSpaceCursorPosition', {x: 0, y: 0});
    this.addProperty('setZoomLevel', this.setZoomLevel.bind(this));
    this.addProperty('setZoomLevelAbsolute', this.setZoomLevelAbsolute.bind(this));
  }

  init() {
    super.init();

    this.zoom(-0.1);
  }

  initEvents() {
    super.initEvents();

    const domElement = this.canvas;

    this.addSubscriptions([
      onMove(domElement, e  => {
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

        // scale down
        const delta = Math.max(-50, Math.min(50, Math.abs(deltaY | 0) / 4));
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

    // store current zoomLevel to store
    this.zoomLevelStore.setZoomLevel(zoomLevel);

    requestRendering();
  }

  setZoomLevelAbsolute(zoomLevel) {
    zoomLevel = this.clampZoomLevel(zoomLevel);

    this.zoomLevel = zoomLevel;
    this.setZoomLevel(zoomLevel);
  }

  clampZoomLevel(zoomLevel) {
    return Math.max(this.cameraController.minZoomLevel,
                     Math.min(this.cameraController.maxZoomLevel,
                              zoomLevel));
  }

  setCursorPosition(x, y) {
    const cursorPosition = this.cameraController.cursorPosition;

    if (cursorPosition.x === x &&
        cursorPosition.y === y) {
      return;
    }
    cursorPosition.x = x;
    cursorPosition.y = y;

    // transform into screen space
    const screenSpaceCursorPosition = this.cameraController.screenSpaceCursorPosition;
    screenSpaceCursorPosition.x = (x / width) * 2 - 1;
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

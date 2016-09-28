import {createLogger} from 'instalog';

import createKeyboardController from 'in-map/misc/common/KeyboardController/KeyboardController';
import createViveController from 'in-map/misc/common/ViveController/ViveController';
import {requestRendering} from 'in-map/stores/renderingStore';
import {loadVRControlsWrapper} from 'in-map/services/webVR';
import WebVRCamera from 'in-map/misc/WebVRCamera';
import {Object3D} from 'in-map/3DLibProvider';


const logger = createLogger('WebVRCameraController');
const height = 1.8; // in meter

class WebVRCameraController {
  constructor(canvas) {
    this.canvas = canvas;
    this.forward = 0;
  }

  init() {
    this.camera = new WebVRCamera();

    this.camTransformObject = new Object3D();
    this.camTransformObject.position.set(0, height, 6);

    this.camTransformObject.add(this.camera.getRenderableCamera());
    this.camTransformObject.updateMatrixWorld();

    const VRControlsClass = loadVRControlsWrapper();
    this.vrControls = new VRControlsClass(this.camera.getRenderableCamera(),
                                          e => logger.error('Failed to create VR controls', e));
    this.updateCamera();

    // controller
    this.viveController = createViveController(this, this.vrControls, 0);
    this.keyboardController = createKeyboardController(this);
  }

  initEvents() {
    this.camera.initEvents();
  }

  flyToPosition() {}
  focusMap() {}
  zoom() {}

  getRenderableCamera() {
    return this.camera.getRenderableCamera();
  }

  moveForward(step) {
    this.forward += step;
  }

  moveSideStep() {
    // noop yet
  }

  update() {
    this.vrControls.update();

    this.keyboardController.update();
    this.viveController.update();

    const camera = this.camera.getRenderableCamera();
    const direction = camera.getWorldDirection().clone();
    this.camTransformObject.position.add(direction.multiplyScalar(this.forward));
    this.camTransformObject.position.setY(height);
    this.camTransformObject.updateMatrixWorld();

    this.updateCamera();

    // reset forward cache
    this.forward = 0;
  }

  updateCamera() {
    // apply current transformations
    this.camera.update();

    requestRendering();
  }

  dispose() {
    this.vrControls.dispose();

    this.viveController.dispose();
    this.viveController = null;

    this.keyboardController.dispose();
    this.keyboardController = null;

    this.camera.dispose();
    this.camera = null;

    this.camTransformObject = null;
    this.canvas = null;
  }
}

export default function createCameraController(canvas) {
  return new WebVRCameraController(canvas);
}

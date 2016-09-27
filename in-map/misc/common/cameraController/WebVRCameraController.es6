import {createLogger} from 'instalog';

import createKeyboardController from 'in-map/misc/common/KeyboardController/KeyboardController';
import createViveController from 'in-map/misc/common/ViveController/ViveController';
import {requestRendering} from 'in-map/stores/renderingStore';
import {loadVRControlsWrapper} from 'in-map/services/webVR';
import WebVRCamera from 'in-map/misc/WebVRCamera';
import {Object3D} from 'in-map/3DLibProvider';


const logger = createLogger('WebVRCameraController');

class WebVRCameraController {
  constructor(canvas) {
    this.canvas = canvas;
  }

  init() {
    this.camera = new WebVRCamera();

    this.camTransformObject = new Object3D();
    this.camTransformObject.position.set(0, 1.8, 6);

    this.camTransformObject.add(this.camera.getRenderableCamera());
    this.camTransformObject.updateMatrixWorld();

    const VRControlsClass = loadVRControlsWrapper();
    this.vrControls = new VRControlsClass(this.camera.getRenderableCamera(),
                                          e => logger.error('Failed to create VR controls', e));
    this.updateCamera();

    window.addEventListener('gamepadconnected', e => {
      logger.info('Gamepad connected at index %d: %s. %d buttons, %d axes.',
        e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);

      if (!this.viveController) {
        this.viveController = createViveController(this.vrControls, e.gamepad.id);
      }
    });

    window.addEventListener('gamepaddisconnected', e => {
      logger.info('Gamepad disconnected from index %d: %s', e.gamepad.index, e.gamepad.id);

      if (this.viveController) {
        this.viveController.dispose();
        this.viveController = null;
      }
    });

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

  update() {
    this.vrControls.update();
    this.camTransformObject.updateMatrixWorld();

    this.updateCamera();

    this.keyboardController.update();

    if (this.viveController) {
      this.viveController.update();
    }
  }

  updateCamera() {
    // apply current transformations
    this.camera.update();

    requestRendering();
  }

  disposeViveController() {
    if (this.viveController) {
      this.viveController.dispose();
      this.viveController = null;
    }
  }

  dispose() {
    this.vrControls.dispose();

    this.disposeViveController();
    this.keyboardController.dispose();

    this.camera.dispose();
    this.camera = null;

    this.camTransformObject = null;
    this.canvas = null;
  }
}

export default function createCameraController(canvas) {
  return new WebVRCameraController(canvas);
}

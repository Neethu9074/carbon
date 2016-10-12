import {createLogger} from 'instalog';

import createKeyboardController from 'in-map/misc/common/KeyboardController/KeyboardController';
import createViveController from 'in-map/misc/common/ViveController/ViveController';
import {addSceneObject, removeSceneObject} from 'in-map/stores/sceneStore';
import {requestRendering} from 'in-map/stores/renderingStore';
import {loadVRControlsWrapper} from 'in-map/services/webVR';
import {Object3D, Vector3} from 'in-map/3DLibProvider';
import WebVRCamera from 'in-map/misc/WebVRCamera';
import {getDeltaTime} from 'in-map/misc/time';


const logger = createLogger('WebVRCameraController');
const height = 1.8; // in meter

class WebVRCameraController {
  constructor(canvas) {
    this.canvas = canvas;
    this.moveDirection = new Vector3(0, 0, 0);
    this.right = new Vector3();
    this.moveSpeed = 5; // units/sec
  }

  init() {
    this.camera = new WebVRCamera();

    this.camTransformObject = new Object3D();
    this.camTransformObject.position.set(0, height, 6);

    this.camTransformObject.add(this.camera.getRenderableCamera());
    this.camTransformObject.updateMatrixWorld();

    addSceneObject(this.camTransformObject);

    const VRControlsClass = loadVRControlsWrapper();
    this.vrControls = new VRControlsClass(this.camera.getRenderableCamera(),
                                          e => logger.info('Failed to create VR controls', e));
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

  move(forward, side) {
    this.moveDirection.z += forward;
    this.moveDirection.x += side;
  }

  update() {
    this.vrControls.update();

    this.keyboardController.update();
    this.viveController.update();

    const speed = getDeltaTime() * this.moveSpeed;
    const camera = this.camera.getRenderableCamera();
    const forward = camera.getWorldDirection().clone();
    this.right.crossVectors(forward, camera.up);

    this.camTransformObject.position.add(forward.multiplyScalar(this.moveDirection.z * speed));
    this.camTransformObject.position.add(this.right.multiplyScalar(this.moveDirection.x * speed));
    this.camTransformObject.position.setY(height);
    this.camTransformObject.updateMatrixWorld();

    this.updateCamera();

    this.moveDirection.set(0, 0, 0);
  }

  updateCamera() {
    // apply current transformations
    this.camera.update();

    requestRendering();
  }

  dispose() {
    removeSceneObject(this.camTransformObject);

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

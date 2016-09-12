import {requestRendering} from 'in-map/stores/renderingStore';
import WebVRCamera from 'in-map/misc/WebVRCamera';
import VRControls from 'in-map/lib/VRControls';
import {Object3D} from 'in-map/3DLibProvider';


class WebVRCameraController {
  constructor(canvas) {
    this.canvas = canvas;
  }

  init() {
    this.camera = new WebVRCamera();

    this.camTransformObject = new Object3D();
    this.camTransformObject.position.set(0, 1.8, 20);

    this.camTransformObject.add(this.camera.getRenderableCamera());
    this.camTransformObject.updateMatrixWorld();

    this.vrControls = new VRControls(this.camera.getRenderableCamera(), e => {
      console.log('ERROR WHEN CREATING VR CONTROLS:', e);
    });

    this.updateCamera();
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
  }

  updateCamera() {
    // apply current transformations
    this.camera.update();

    requestRendering();
  }

  dispose() {
    this.vrControls.dispose();

    this.camera.dispose();
    this.camera = null;

    this.camTransformObject = null;
    this.canvas = null;
  }
}

export default function createCameraController(canvas) {
  return new WebVRCameraController(canvas);
}

import { Matrix4, OrthographicCamera } from 'in-map/3DLibProvider';
import { width, height } from 'in-map/stores/indexStore';
import { dimensions$ } from 'in-map/stores/indexStore';
import Subscriber from 'in-map/misc/Subscriber';

const INVERSE = new Matrix4();

export default class OrthographicCameraWrapper extends Subscriber {
  constructor() {
    super();

    // a multiplicator for a homogenious viewport * aspect
    this.cameraSize = 30;
    const cameraSizeHalf = this.cameraSize / 2;

    const aspect = width / height;
    const left = -cameraSizeHalf * aspect;
    const top = cameraSizeHalf;
    const camera = (this.camera = new OrthographicCamera(
      left,
      -left,
      top,
      -top,
      0.1, // near
      2500 // far
    ));

    camera.projection = new Matrix4();

    // set static
    camera.rotationAutoUpdate = false;
    camera.matrixAutoUpdate = false;
  }

  initEvents() {
    this.addSubscription(dimensions$.subscribe(() => this.updateCameraFromSize()));
  }

  update() {
    const camera = this.camera;
    const camProjectionMat = camera.projectionMatrix;

    // updateMatrix is called in controller before
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();

    // sets INVERSE to camera.matrixWorld^-1
    INVERSE.getInverse(camera.matrixWorld);

    // sets the projection matrix
    camera.projection.multiplyMatrices(camProjectionMat, INVERSE);
  }

  setCameraSize(value) {
    this.cameraSize = Math.min(Math.max(1, value), 300);
  }

  updateCameraFromSize() {
    // we start in the middle and go totalWidth / 2 to the left
    const camSizeHalf = this.cameraSize / 2;
    const aspect = width / height;

    this.camera.left = -camSizeHalf * aspect;
    this.camera.right = camSizeHalf * aspect;
    this.camera.bottom = -camSizeHalf;
    this.camera.top = camSizeHalf;
  }

  getRenderableCamera() {
    return this.camera;
  }

  dispose() {
    super.dispose();

    this.cameraSize = null;
    this.camera = null;
  }
}

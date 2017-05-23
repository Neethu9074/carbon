import { PerspectiveCamera, Matrix4 } from 'in-map/3DLibProvider';
import { width, height } from 'in-map/stores/indexStore';
import { dimensions$ } from 'in-map/stores/indexStore';
import Subscriber from 'in-map/misc/Subscriber';

const INVERSE = new Matrix4();

export default class VRCamera extends Subscriber {
  constructor() {
    super();

    const camera = (this.camera = new PerspectiveCamera(
      45, // fov
      width / height, // aspect
      0.1, // near
      2000 // far
    ));

    camera.projection = new Matrix4();
  }

  initEvents() {
    this.addSubscription(
      dimensions$.subscribe(() => {
        this.update();
        this.updateCameraFromSize();
      })
    );
  }

  updateCameraFromSize() {
    this.camera.aspect = width / height;
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

  getPosition() {
    return this.camera.position;
  }

  updateProjectionMatrix() {
    this.camera.updateProjectionMatrix();
  }

  updateMatrix() {
    this.camera.updateMatrix();
  }

  getRenderableCamera() {
    return this.camera;
  }

  dispose() {
    super.dispose();

    this.camera = null;
  }
}

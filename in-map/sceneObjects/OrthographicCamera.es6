import THREE from 'three';


const INVERSE = new THREE.Matrix4();

export default class OrthographicCamera {

  constructor(width, height) {
    this.width = width;
    this.height = height;

    // a multiplicator for a homogenious viewport * aspect
    this.cameraSize = 30;
    const cameraSizeHalf = this.cameraSize / 2;

    const aspect = width / height;
    const left = -cameraSizeHalf * aspect;
    const top = cameraSizeHalf;
    const camera = this.camera = new THREE.OrthographicCamera(
      left, -left, top, -top,
      0.1, // near
      2000 // far
    );

    // camera.position.set(-0.8, 1, 1);
    // camera.lookAt(new THREE.Vector3());
    camera.projection = new THREE.Matrix4();

    // set static
    camera.rotationAutoUpdate = false;
    camera.matrixAutoUpdate = false;
    camera.updateMatrix();
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

  setSize(width, height) {
    this.width = width;
    this.height = height;
  }

  setCameraSize(value) {
    this.cameraSize = Math.min(Math.max(10, value), 300);
  }

  getCameraSize() {
    return this.cameraSize;
  }

  setCameraFromSize() {
    // we start in the middle and go totalWidth / 2 to the left
    const camSizeHalf = this.cameraSize / 2;
    const aspect = this.width / this.height;

    this.camera.left = -camSizeHalf * aspect;
    this.camera.right = camSizeHalf * aspect;
    this.camera.bottom = -camSizeHalf;
    this.camera.top = camSizeHalf;
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
    this.cameraSize = null;
    this.camera = null;
    this.height = null;
    this.width = null;
  }
}

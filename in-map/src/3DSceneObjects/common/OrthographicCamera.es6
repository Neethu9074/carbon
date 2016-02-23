import THREE from 'three';

import SceneObject from './SceneObject';


const INVERSE = new THREE.Matrix4();

export default class OrthographicCamera extends SceneObject {

  constructor({ scene }) {
    super({parent: scene, id: 'Camera'});

    const width = this.width = scene.width;
    const height = this.height = scene.height;

    // a multiplicator for a homogenious viewport * aspect
    this.cameraSize = 30;

    const aspect = width / height;
    const left = -this.cameraSize / 2 * aspect;
    const top = this.cameraSize / 2;
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

    // projection matrix is updated in update loop
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

  dispose() {
    super.dispose();

    this.camera = null;
  }
}

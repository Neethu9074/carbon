/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getServiceLocators } from 'in-applications/FlowMap/serviceLocator/serviceLocator';
import { Matrix4, OrthographicCamera } from 'in-map/3DLibProvider';

export default class OrthographicCameraWrapper {
  constructor(serviceLocatorUid) {
    this.serviceLocatorUid = serviceLocatorUid;
    this.inverse = new Matrix4();

    // a multiplicator for a homogenious viewport * aspect
    this.cameraSize = 1;
    this.aspect = 1;

    const cameraSizeHalf = this.cameraSize / 2;

    const left = cameraSizeHalf;
    const top = cameraSizeHalf * this.aspect;
    const camera = (this.camera = new OrthographicCamera(
      -left,
      left,
      top,
      -top,
      0.1, // near
      100 // far
    ));

    camera.projection = new Matrix4();

    // set static
    camera.rotationAutoUpdate = false;
    camera.matrixAutoUpdate = false;

    camera.position.z = 1;
  }

  update() {
    const camera = this.camera;
    const camProjectionMat = camera.projectionMatrix;

    camera.updateMatrix();
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();

    // sets INVERSE to camera.matrixWorld^-1
    this.inverse.getInverse(camera.matrixWorld);

    // sets the projection matrix
    camera.projection.multiplyMatrices(camProjectionMat, this.inverse);

    getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.emit('cameraUpdate', this);
  }

  setCameraSize(value) {
    this.cameraSize = Math.max(1, value);
    this.updateCameraFromSize();
  }

  getCameraSize() {
    return this.cameraSize;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.aspect = height / width;

    this.updateCameraFromSize();

    getServiceLocators(this.serviceLocatorUid)
      .sceneServiceLocator.getScene()
      .requestRendering();
  }

  setPosition(x, y) {
    this.camera.position.set(x, y, 1);
  }

  getPosition() {
    return this.camera.position;
  }

  updateCameraFromSize() {
    // we start in the middle and go totalWidth / 2 to the left
    const camSizeHalf = this.cameraSize / 2;

    this.camera.left = -camSizeHalf;
    this.camera.right = camSizeHalf;
    this.camera.top = camSizeHalf * this.aspect;
    this.camera.bottom = -camSizeHalf * this.aspect;
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

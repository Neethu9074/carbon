import THREE from 'three';

import AnimationController from 'in-map/src/AnimationController';

import BaseCameraController from './BaseCameraController';
import MouseControlsModule from './MouseControlsModule';
import TouchControlsModule from './TouchControlsModule';
import RaycasterModule from './RaycasterModule';
import * as time from '../timeCalculations';


const _quaternion = new THREE.Quaternion();
const _position = new THREE.Vector3();
const _scale = new THREE.Vector3();
const startRoll = -40;

export default class ProcessCameraController extends BaseCameraController {

  constructor({scene, camera, canvas}) {
    super();

    this.camera = camera;
    this.scene = scene;

    // this is an abstract zoomLevel, needed to store calculte the frustum size of
    // of the camera and the distance to the POI
    this.zoomLevel = 1000;

    // this is the speed te camera will move to the new pos on drag
    this.cameraMoveSpeed = 0.02;

    this.targetCameraPOIPosition = new THREE.Object3D();
    this.targetCameraPOIPosition.rotateY(-30 * Math.PI / 180);

    // this is the target frustum size (or the zoom level in abstract) for the camera.
    // It will be animated during the update routine
    this.targetCameraFrustumSize = camera.getCameraSize();
    this.cameraFrunstumSizeAnimationSpeed = 5;

    // this is the target z position for the camera.
    // It will not be animated during the update routine
    this.targetCameraZPosition = 200;

    this.init();

    this.fromRoll = startRoll;
    this.toRoll = -89.5;
    this.animationController = new AnimationController({
      onUpdate: this.onAnimationUpdate.bind(this),
      onStop: this.onAnimationStop.bind(this),
      timeToAnimate: 500
    });
    this.setupEvents();

    const eventEmitter = this.eventEmitter;
    this.interactionModules.push(
      new MouseControlsModule({eventEmitter, scene, canvas}),
      new TouchControlsModule({eventEmitter, scene, canvas}),
      new RaycasterModule({eventEmitter, scene, camera: this.camera})
    );
    eventEmitter.emit('onZoom', 0);
  }

  init() {
    // transformation helper. need this to move on the ground
    this.camMoveHelper = new THREE.Object3D();
    this.camMoveHelper.add(new THREE.AxisHelper(2));
    this.camMoveHelper.rotateY(-30 * Math.PI / 180);

    this.camRotationHelper = new THREE.Object3D();
    this.camRotationHelper.rotateX(startRoll * Math.PI / 180);
    this.camRotationHelper.add(new THREE.AxisHelper(1));
    this.camMoveHelper.add(this.camRotationHelper);

    this.camTargetPosition = new THREE.Object3D();
    this.camTargetPosition.position.z = 10;
    this.camTargetPosition.add(new THREE.AxisHelper(0.5));
    this.camRotationHelper.add(this.camTargetPosition);
  }

  onAnimationStop() {
    this.animationController.stop();
    const cache = this.toRoll;
    this.toRoll = this.fromRoll;
    this.fromRoll = cache;
  }

  onAnimationUpdate(v) {
    this.camRotationHelper.rotation.set(0, 0, 0);
    this.camRotationHelper.rotateX((this.fromRoll + (this.toRoll - this.fromRoll) * v) * Math.PI / 180);
  }

  setupEvents() {
    this.addSubscriptions([
      this.eventEmitter.on('onMove').subscribe(delta => this.onMove(delta)),

      this.eventEmitter.on('onZoom').subscribe(delta => this.onZoom(delta)),

      this.eventEmitter.on('onDoubleClicked').subscribe(() => this.onDoubleClicked()),

      this.eventEmitter.on('onObjectClicked').subscribe(hittenOnes => this.scene.onObjectClicked(hittenOnes))
    ]);
  }

  refreshCameraTransformHierarchy() {
    this.camMoveHelper.updateMatrixWorld(true);
    this.camRotationHelper.updateMatrixWorld(true);
    this.camTargetPosition.updateMatrixWorld(true);

    this.camTargetPosition.matrixWorld.decompose(_position, _quaternion, _scale);

    this.camera.camera.position.copy(_position);
    this.camera.camera.lookAt(this.camMoveHelper.position);
    this.camera.updateMatrix();
    this.camera.update();

    this.scene.renderScene();
  }

  onZoom(delta) {
    this.zoomLevel += delta;
    this.zoomLevel = Math.min(Math.max(this.zoomLevel, 200), 1500);

    this.targetCameraZPosition = this.zoomLevel / 2.5;
    this.targetCameraFrustumSize = this.zoomLevel / 20;
  }

  onDoubleClicked() {
    this.animationController.start();
  }

  onMove({dx, dy}) {
    this.targetCameraPOIPosition.translateX(-dx * this.cameraMoveSpeed);
    this.targetCameraPOIPosition.translateZ(-dy * this.cameraMoveSpeed);
  }

  update() {
    const dt = time.getDeltaTime();
    const deltaCamSize = this.targetCameraFrustumSize - this.camera.getCameraSize();
    const deltaCamZPosition = this.targetCameraZPosition - this.camTargetPosition.position.z;
    const deltaCamPOIPositionX = this.targetCameraPOIPosition.position.x - this.camMoveHelper.position.x;
    const deltaCamPOIPositionZ = this.targetCameraPOIPosition.position.z - this.camMoveHelper.position.z;


    if (!this.isAnyValueGreaterThanEpsilon(
      deltaCamSize,
      deltaCamZPosition,
      deltaCamPOIPositionX,
      deltaCamPOIPositionZ) && !this.animationController.animationInProgress) {
      return;
    }

    this.camMoveHelper.position.x = this.targetCameraPOIPosition.position.x;
    this.camMoveHelper.position.z = this.targetCameraPOIPosition.position.z;

    const wayToMove = Math.min(1, dt * this.cameraFrunstumSizeAnimationSpeed);
    this.camera.setCameraSize(
      this.camera.getCameraSize() + deltaCamSize * wayToMove);
    this.camera.setCameraFromSize();

    this.camTargetPosition.position.z += deltaCamZPosition * wayToMove;

    this.refreshCameraTransformHierarchy();
  }

  isAnyValueGreaterThanEpsilon() {
    for (let i = 0; i < arguments.length; i++) {
      if (Math.abs(arguments[i]) > 0.0001) {
        return true;
      }
    }
    return false;
  }

  dispose() {
    super.dispose();

    this.cameraFrunstumSizeAnimationSpeed = null;
    this.targetCameraFrustumSize = null;
    this.targetCameraZPosition = null;
    this.cameraMoveSpeed = null;
    this.zoomLevel = null;
    this.camera = null;
    this.scene = null;
  }
}

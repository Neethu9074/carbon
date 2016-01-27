import TWEEN from 'tween.js';
import THREE from 'three';

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
    this.zoomLevel = 0;

    // this is the speed the camera will move to the new pos on drag
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
    this.setupAnimation();
    this.setupEvents();

    const eventEmitter = this.eventEmitter;
    this.interactionModules = [
      new MouseControlsModule({eventEmitter, scene, canvas}),
      new TouchControlsModule({eventEmitter, scene, canvas}),
      new RaycasterModule({eventEmitter, scene, camera: this.camera})
    ];
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

  setupAnimation() {
    let fromRoll = startRoll;
    let toRoll = -89.5;
    const from = {v: 0.0}; // 0%
    const to = {v: 1.0}; // 100%

    // updating from 0 to 1 in 500 ms
    const animation = new TWEEN.Tween(from).to(to, 500);
    animation.easing(TWEEN.Easing.Cubic.InOut);
    animation.onUpdate((v) => {
      this.camRotationHelper.rotation.set(0, 0, 0);
      this.camRotationHelper.rotateX((fromRoll + (toRoll - fromRoll) * v) * Math.PI / 180);
    });
    animation.onComplete(() => {
      this.aniamte = false;
      const cache = toRoll;
      toRoll = fromRoll;
      fromRoll = cache;
    });

    this.animation = animation;
    this.animation.stop();
  }

  setupEvents() {
    this.addSubscription(this.eventEmitter.on('onMove')
      .subscribe(delta => this.onMove(delta)));

    this.addSubscription(this.eventEmitter.on('onZoom')
      .subscribe(delta => this.onZoom(delta)));

    this.addSubscription(this.eventEmitter.on('onDoubleClicked')
      .subscribe(() => this.onDoubleClicked()));

    this.addSubscription(this.eventEmitter.on('onObjectClicked')
      .subscribe(({hittenObject, hoveredConnections}) => this.scene.onObjectClicked(hittenObject, hoveredConnections)));
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
    this.targetCameraZPosition += delta / 4;
    this.targetCameraFrustumSize += delta / 20;
  }

  onDoubleClicked() {
    this.animation.stop();
    this.aniamte = true;
    this.animation.start();
  }

  onMove({dx, dy}) {
    this.targetCameraPOIPosition.translateX(-dx * this.cameraMoveSpeed);
    this.targetCameraPOIPosition.translateZ(-dy * this.cameraMoveSpeed);
  }

  update() {
    const dt = time.getDeltaTime();
    if (this.aniamte) {
      this.animation.update(time.getNow());
    }

    const deltaCamSize = this.targetCameraFrustumSize - this.camera.getCameraSize();
    const deltaCamZPosition = this.targetCameraZPosition - this.camTargetPosition.position.z;
    const deltaCamPOIPositionX = this.targetCameraPOIPosition.position.x - this.camMoveHelper.position.x;
    const deltaCamPOIPositionZ = this.targetCameraPOIPosition.position.z - this.camMoveHelper.position.z;


    if (!this.isAnyValueGreaterThanEpsilon(
      deltaCamSize,
      deltaCamZPosition,
      deltaCamPOIPositionX,
      deltaCamPOIPositionZ
    ) && !this.aniamte) {
      return;
    }

    this.camMoveHelper.position.x = this.targetCameraPOIPosition.position.x;
    this.camMoveHelper.position.z = this.targetCameraPOIPosition.position.z;

    this.camera.setCameraSize(
      this.camera.getCameraSize() + deltaCamSize * Math.min(1, dt * this.cameraFrunstumSizeAnimationSpeed));
    this.camera.setCameraFromSize();

    this.camTargetPosition.position.z += deltaCamZPosition;
    this.camTargetPosition.position.z = Math.min(Math.max(80, this.camTargetPosition.position.z), 1000);

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

    this.interactionModules.forEach(module => module.dispose());
    this.interactionModules = [];
    this.camera = null;
    this.scene = null;
    this.zoomLevel = null;
    this.cameraMoveSpeed = null;
    this.targetCameraFrustumSize = null;
    this.cameraFrunstumSizeAnimationSpeed = null;
    this.targetCameraZPosition = null;
  }
}

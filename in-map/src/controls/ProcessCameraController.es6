import TWEEN from 'tween.js';
import THREE from 'three';

import MouseControlsModule from './MouseControlsModule';
import TouchControlsModule from './TouchControlsModule';
import * as time from '../timeCalculations';


const _quaternion = new THREE.Quaternion();
const _position = new THREE.Vector3();
const _scale = new THREE.Vector3();
const startRoll = -40;

export default class ProcessCameraController {

  constructor({scene, camera, canvas}) {
    this.camera = camera;
    this.scene = scene;

    // this is an abstract zoomLevel, needed to store calculte the frustum size of
    // of the camera and the distance to the POI
    this.zoomLevel = 0;

    // this is the speed the camera will move to the new pos on drag
    this.cameraMoveSpeed = 0.02;

    // copy this property to animate it
    this.targetCameraFrustumSize = camera.getCameraSize();
    this.cameraFrunstumSizeAnimationSpeed = 5;

    this.targetCameraZPosition = 200;

    this.init();
    this.setupAnimation();

    this.interactionModules = [
      new MouseControlsModule({parent: this, scene, canvas}),
      new TouchControlsModule({parent: this, scene, canvas})
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

  zoom(delta) {
    this.targetCameraZPosition += delta / 4;
    this.targetCameraFrustumSize += delta / 20;
  }

  onClicked() {}

  onDoubleClicked() {
    this.animation.stop();
    this.aniamte = true;
    this.animation.start();
  }

  onMouseMoved(/* lastMousePosition */) {
    // console.log('mousemoved', lastMousePosition)
  }

  move(dx, dy) {
    this.camMoveHelper.translateX(-dx * this.cameraMoveSpeed);
    this.camMoveHelper.translateZ(-dy * this.cameraMoveSpeed);
  }

  update() {
    const dt = time.getDeltaTime();
    if (this.aniamte) {
      this.animation.update(time.getNow());
    }

    const deltaCamSize = this.targetCameraFrustumSize - this.camera.getCameraSize();
    const deltaCamZPosition = this.targetCameraZPosition - this.camTargetPosition.position.z;


    // TODO: dont render if not nessessary
    if (Math.abs(deltaCamSize) <= 0.0001 && Math.abs(deltaCamZPosition) < 0.0001) {
      return;
    }

    this.camera.setCameraSize(
      this.camera.getCameraSize() + deltaCamSize * Math.min(1, dt * this.cameraFrunstumSizeAnimationSpeed));
    this.camera.setCameraFromSize();

    this.camTargetPosition.position.z += deltaCamZPosition;
    this.camTargetPosition.position.z = Math.min(Math.max(80, this.camTargetPosition.position.z), 1000);

    this.refreshCameraTransformHierarchy();
  }

  dispose() {
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

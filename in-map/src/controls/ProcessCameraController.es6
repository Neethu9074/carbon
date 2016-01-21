import TWEEN from 'tween.js';
import THREE from 'three';

import MouseControlsModule from './MouseControlsModule';
import TouchControlsModule from './TouchControlsModule';
import * as time from '../timeCalculations';


const _quaternion = new THREE.Quaternion();
const _position = new THREE.Vector3();
const _scale = new THREE.Vector3();
const startRoll = -40;

export default class CameraController {

  constructor({scene, camera, canvas}) {
    this.camera = camera;
    this.scene = scene;
    this.zoomLevel = 0;
    this.cameraMoveSpeed = 0.02;

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
    this.camTargetPosition.position.z = 200;
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
    this.camera.setCameraSize(this.camera.cameraSize + delta / 20);
    this.camera.setCameraFromSize();
    this.camera.update();

    this.camTargetPosition.position.z += delta / 4;
    this.camTargetPosition.position.z = Math.min(Math.max(80, this.camTargetPosition.position.z), 1000);

    this.scene.renderScene();
  }

  onClick() {}

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
    if (this.aniamte) {
      this.animation.update(time.getNow());
    }
    this.refreshCameraTransformHierarchy();
  }

  dispose() {
  }
}

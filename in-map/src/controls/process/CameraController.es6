import {combineLatest} from 'reactive-observables';
import THREE from 'three';

import BaseCameraController from 'in-map/src/controls/common/CameraController';
import {requestRendering} from 'in-map/src/stores/renderingStore';
import AnimationController from 'in-map/src/AnimationController';
import {longClickedSceneObject} from 'in-map/src/mapStores';
import {view$} from 'in-map/src/stores/process/viewStore';
import * as time from 'in-map/src/timeCalculations';
import {currentTooltip} from 'in-map/src/mapStores';

import MouseControlsModule from 'in-map/src/controls/common/MouseControlsModule';
import TouchControlsModule from 'in-map/src/controls/common/TouchControlsModule';
import DragAndDropModule from 'in-map/src/controls/common/DragAndDropModule';
import RaycasterModule from 'in-map/src/controls/common//RaycasterModule';


const QUATERNION = new THREE.Quaternion();
const POSITION = new THREE.Vector3();
const SCALE = new THREE.Vector3();
const START_ROLL = -40;

export default class CameraController extends BaseCameraController {

  constructor({scene, camera, canvas, map}) {
    super();

    this.camera = camera;
    this.scene = scene;

    // this is an abstract zoomLevel, needed to store calculte the frustum size of
    // of the camera and the distance to the POI
    this.zoomLevel = 500;

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

    this.fromRoll = START_ROLL;
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
      new RaycasterModule({eventEmitter, scene, camera: this.camera}),
      new DragAndDropModule({eventEmitter, map, canvas, scene, camera: this.camera})
    );
    eventEmitter.emit('onZoom', 0);
  }

  init() {
    // transformation helper. need this to move on the ground
    this.camMoveHelper = new THREE.Object3D();
    this.camMoveHelper.add(new THREE.AxisHelper(2));
    this.camMoveHelper.rotateY(-30 * Math.PI / 180);

    this.camRotationHelper = new THREE.Object3D();
    this.camRotationHelper.rotateX(START_ROLL * Math.PI / 180);
    this.camRotationHelper.add(new THREE.AxisHelper(1));
    this.camMoveHelper.add(this.camRotationHelper);

    this.camTargetPosition = new THREE.Object3D();
    this.camTargetPosition.position.z = 10;
    this.camTargetPosition.add(new THREE.AxisHelper(0.5));
    this.camRotationHelper.add(this.camTargetPosition);
  }

  onAnimationStop() {
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
      combineLatest([
        this.eventEmitter.on('onMove'),
        this.eventEmitter.on('isDragingObject')
      ]).subscribe(props => {
        const isDragingObject = props[1];
        if (!isDragingObject) {
          this.onMove(props[0]);
        }
      }),

      this.eventEmitter.on('onZoom').subscribe(delta => this.onZoom(delta)),

      this.eventEmitter.on('onObjectClicked').subscribe(hittenOnes => this.scene.onObjectClicked(hittenOnes)),

      view$.skipFirst().subscribe(() => this.animationController.start()),

      this.eventEmitter.on('onObjectDoubleClicked').subscribe(hittenOne =>
        longClickedSceneObject.emit(hittenOne.parentSceneObject)),

      this.eventEmitter.on('setConnectionTooltip').subscribe(() => currentTooltip.emit(null)),

      this.eventEmitter.on('clearConnectionTooltip').subscribe(() => currentTooltip.emit(null))
    ]);
  }

  refreshCameraTransformHierarchy() {
    this.camMoveHelper.updateMatrixWorld(true);
    this.camRotationHelper.updateMatrixWorld(true);
    this.camTargetPosition.updateMatrixWorld(true);

    this.camTargetPosition.matrixWorld.decompose(POSITION, QUATERNION, SCALE);

    this.camera.camera.position.copy(POSITION);
    this.camera.camera.lookAt(this.camMoveHelper.position);
    this.camera.updateMatrix();
    this.camera.update();

    requestRendering();
  }

  onZoom(delta) {
    this.zoomLevel -= delta;
    this.zoomLevel = Math.min(Math.max(this.zoomLevel, 200), 1800);

    this.targetCameraZPosition = this.zoomLevel / 2.5;
    this.targetCameraFrustumSize = this.zoomLevel / 20;

    this.scene.onZoom({zoomLevel: this.zoomLevel});
    this.eventEmitter.emit('onZoomLevelChange', this.zoomLevel);
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

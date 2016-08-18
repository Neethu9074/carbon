import {combineLatest} from 'reactive-observables';
import RoEmitter from 'roemitter';
import THREE from 'three';

import {setSelectedSnapshotId, clearSelectedSnapshotId} from 'in-stores/snapshot';
import createObjectCollection from 'in-map/stores/ObjectCollection';
import {setCameraController} from 'in-map/stores/cameraController';
import {requestRendering} from 'in-map/stores/renderingStore';
import {clearSelectedIncident} from 'in-stores/incident';
import {clearSelectedEvent} from 'in-stores/events';
import {emptyArray} from 'in-services/fixedObjects';
import {goToDashboard} from 'in-stores/navigation';
import {eventBus} from 'in-map/services/eventBus';
import Subscriber from 'in-map/misc/Subscriber';
import {ZERO} from 'in-map/misc/fixedVectors';


export default class CameraController extends Subscriber {

  constructor(scene, map) {
    super();

    this.interactionModules = createObjectCollection();
    this.eventEmitter = new RoEmitter('control event emitter');

    this.camera = scene.camera;
    this.scene = scene;
    this.map = map;

    this.hoveredConnections = emptyArray;
    this.hittenObject = null;

    // this counter is used to check if the cameraSpeed can be resetted
    this.zoomCalls = 0;

    this.defaultCameraSpeed = 100; // camera fly speed
    this.cameraSpeed = this.defaultCameraSpeed; // camera fly speed
    this.moveSpeed = 0.01; // distance moved per pixel

    // raytracing fields
    this.raycaster = new THREE.Raycaster();

    // the units moved between a mouseDown/touchStart and mouseUp/TouchEnd
    this.unitsMoved = 0;

    // the cursor position in pixel-space ([0, width], [0, height])
    this.cursorPosition = {x: 0, y: 0};

    // the cursor position in screen-space ([-1, 1], [-1, 1])
    this.screenSpaceCursorPosition = {x: 0, y: 0};

    // zoom fields
    this.maxZoomOut = 1800;
    this.normalZoomOut = 400; // 100%
    this.maxZoomIn = 20;

    // the current Level of zooming
    this.zoomLevel = 250;

    // the wished level of zooming
    this.targetZoomLevel = 100;

    this.zoomSpeed = 10;
    this.scrollSpeed = 5;
  }

  init(xOffset) {
    const renderableCamera = this.camera.getRenderableCamera();
    renderableCamera.position.set(xOffset, 1, 1);
    renderableCamera.lookAt(ZERO);

    this.setZoomLevel(500);

    this.camera.update();

    const pitch = -45;
    // transformation helper. need this to move on the ground
    this.camTransformObject = new THREE.Object3D();
    this.camTransformObject.position.set(10, 0, -10);
    this.camTransformObject.rotation.y = pitch * Math.PI / 180;

    this.directionToCam = this.camera.getPosition()
      .clone()
      .sub(ZERO)
      .normalize();
  }

  initEvents() {
    this.addSubscriptions([
      combineLatest([
        this.eventEmitter.on('onMove'),
        this.eventEmitter.on('isDragingObject')
      ]).subscribe(([delta, isDraging]) => {
        if (!isDraging) {
          this.onMove(delta);
        }
      }),

      this.eventEmitter.on('onZoom').subscribe(delta => this.onZoom(delta)),

      this.eventEmitter.on('onMouseMoved').subscribe(newPos => this.setCursorPosition(newPos)),

      this.eventEmitter.on('onObjectClicked').subscribe((hittenOnes) => this.onObjectClicked(hittenOnes)),

      this.eventEmitter.on('onObjectDoubleClicked').subscribe(hittenOne =>
        goToDashboard(hittenOne.parentSceneObject.id))
    ]);

    this.eventEmitter.emit('isDragingObject', false);

    setCameraController(this);
  }

  addInteractionModule(name, Class) {
    const params = {
      eventEmitter: this.eventEmitter,
      canvas: this.scene.canvas,
      camera: this.camera,
      scene: this.scene,
      map: this.map,
      client: this
    };
    this.interactionModules.add(name, new Class(params));
  }

  centerMousePosition() {
    this.setCursorPosition({
      x: this.scene.width / 2,
      y: this.scene.height / 2
    });
  }

  setCursorPosition({x, y}) {
    if (this.cursorPosition.x === x &&
        this.cursorPosition.y === y) {
      return;
    }
    this.cursorPosition.x = x;
    this.cursorPosition.y = y;

    // transform into screen space
    this.screenSpaceCursorPosition.x = (x / this.camera.width) * 2 - 1;
    this.screenSpaceCursorPosition.y = -(y / this.camera.height) * 2 + 1;
  }

  onMove({dx, dy}) {
    // the pixels moved until last mouseDown / touchDown
    // set this before dx and dy gets manipulated
    this.unitsMoved += Math.sqrt(
      Math.pow(dx, 2) +
      Math.pow(dy, 2));

    const min = this.maxZoomOut;
    const max = this.maxZoomIn;

    // [0, 1] => [1, 11]
    const nZoomLevel = (this.zoomLevel / (min - max) * 10) + 1;
    dx *= nZoomLevel;
    dy *= nZoomLevel;

    const transObj = this.camTransformObject;
    transObj.translateX(-dx * this.moveSpeed);
    transObj.translateZ(-dy * this.moveSpeed);

    transObj.updateMatrixWorld();

    // TODO: clamp the position to avoid overflow of the level area
  }

  onZoom(delta) {
    if (delta === 0) {
      return;
    }
    const min = this.maxZoomOut;
    const max = this.maxZoomIn;
    const nZoomLevel = this.zoomLevel / (min - max); // [0 nearest, 1 farest]

    delta *= nZoomLevel * this.scrollSpeed;

    this.targetZoomLevel -= delta;
    const newTargetZoomLevel = Math.max(max, Math.min(min, (this.targetZoomLevel))); // [min, max]

    this.targetZoomLevel = newTargetZoomLevel;
    eventBus.emit('zoomLevelChanged', newTargetZoomLevel);

    this.cameraSpeed = 1000;
    this.zoomCalls++;
    setTimeout(() => {
      this.zoomCalls--;
      if (this.zoomCalls === 0) {
        this.cameraSpeed = this.defaultCameraSpeed;
      }
    }, 500);
  }

  setZoomLevel(zL) {
    const min = this.maxZoomOut;
    const max = this.maxZoomIn;

    this.targetZoomLevel = Math.max(max, Math.min(min, (zL)));
    eventBus.emit('zoomLevelChanged', this.targetZoomLevel);
  }

  flyToPosition(pos) {
    this.flyToPositionXZ(pos.x, pos.z);
  }

  flyToPositionXZ(x, z) {
    const transObj = this.camTransformObject;

    transObj.position.x = x;
    transObj.position.z = z;
    transObj.updateMatrixWorld();
  }

  update(dTime) {
    this.updateZoomLevel(dTime);

    const cam = this.camera;
    const targetWorldPos = new THREE.Vector3();

    targetWorldPos
      .applyMatrix4(this.camTransformObject.matrixWorld)
      .add(this.directionToCam
        .clone()
        .multiplyScalar(this.zoomLevel));

    // calculate the delta between wanted position and current position
    const direction = cam.getPosition()
      .clone()
      .sub(targetWorldPos);

    // get the total distance from the camera position to target position
    const distance = direction.length();

    // camera can only move this direction in units/sec (dTime = 1 / sec)
    const delta = direction.clone().multiplyScalar(dTime * this.cameraSpeed);

    // if the distance after multiplication is bigger than the total distance
    // set it to total distance
    if (delta.length() > distance) {
      delta.normalize().multiplyScalar(distance);
    }
    if (delta.length() < 0.001) {
      return;
    }

    // move to target position with cameraspeed in units/sec
    cam.getPosition().sub(delta);
    cam.getRenderableCamera().updateMatrix();
    requestRendering();
  }

  updateZoomLevel(dT) {
    const delta = this.targetZoomLevel - this.zoomLevel;

    this.zoomLevel += delta * dT * this.zoomSpeed;

    // get the position of the point in world space where the mouse is pointing at and before the camera zoomed in
    const pointOfImpact = this.getPointOfImpact();

    // change camera size for zoom effect
    this.camera.cameraSize = this.zoomLevel / 10;
    this.camera.setCameraFromSize();

    if (!pointOfImpact) {
      return;
    }

    this.camera.getRenderableCamera().updateProjectionMatrix();

    // get the new screenPosition of the impact point so that you can calculate the delta in screen space
    const pointOfImpactNew = this.getPointOfImpact();
    if (!pointOfImpactNew) {
      return;
    }
    const transObj = this.camTransformObject;
    transObj.position.x += pointOfImpact.x - pointOfImpactNew.x;
    transObj.position.z += pointOfImpact.z - pointOfImpactNew.z;
    transObj.updateMatrixWorld();
  }

  getPointOfImpact() {
    return this.interactionModules.get('raycaster').checkObject(this.map.groundPlane.getCollisionMesh());
  }

  setCurrentHittenObjects(hittenObject, hoveredConnections) {
    this.hoveredConnections = hittenObject;
    this.hittenObject = hoveredConnections;
  }

  onObjectClicked({hittenObject, hoveredConnections}) {
    if (hittenObject) {
      const parentSceneObject = hittenObject.parentSceneObject;
      const sceneObject = parentSceneObject ? parentSceneObject : hittenObject;
      setSelectedSnapshotId(sceneObject.id);
    // dont reset the click if you clicken on connections
    } else if (hoveredConnections.length === 0) {
      // the was something clicked but no object or connection available -> reset
      clearSelectedSnapshotId();
      clearSelectedIncident();
      clearSelectedEvent();
    } else {
      setSelectedSnapshotId(hoveredConnections[0].id);
    }
  }

  dispose() {
    setCameraController(null);

    Object.keys(this.interactionModules.objects).forEach(key => {
      this.interactionModules.objects[key].dispose();
      this.interactionModules.remove(key);
    });

    this.eventEmitter.dispose();
    super.dispose();

    this.defaultCameraSpeed = null;
    this.camTransformObject = null;
    this.targetZoomLevel = null;
    this.directionToCam = null;
    this.normalZoomOut = null;
    this.cameraSpeed = null;
    this.scrollSpeed = null;
    this.unitsMoved = null;
    this.maxZoomOut = null;
    this.zoomCalls = null;
    this.moveSpeed = null;
    this.raycaster = null;
    this.maxZoomIn = null;
    this.zoomLevel = null;
    this.zoomSpeed = null;
    this.camera = null;
    this.states = null;
    this.state = null;
    this.scene = null;
    this.map = null;
  }
}

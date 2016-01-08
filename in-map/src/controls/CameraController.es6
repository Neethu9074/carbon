import THREE from 'three';

import * as tooltipStore from 'in-services/stores/tooltip';

import ConnectionTooltip from '../sceneObjects/Tooltips/Connection';
import {allConnections} from '../sceneObjects/Connection';
import {currentTooltip} from '../mapStores';
import * as time from '../timeCalculations';
import {setupStates} from './States/index';


export default class CameraController {

  constructor({scene, map}) {
    this.camera = map.camera;

    this.bindListeners();
    this.init(scene, map);

    this.setZoomLevel(260);
    this.states = setupStates(this);
    this.state = this.states.mid;
    this.connectionTooltip = new ConnectionTooltip(scene, []);
  }

  bindListeners() {
    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
    this.zoom = this.zoom.bind(this);
  }

  init(scene, map) {
    this.scene = scene;
    this.map = map;

    // this counter is used to check if the cameraSpeed can be resetted
    this.zoomCalls = 0;

    // holds the mouse/touch position in pixel coordinates
    this.cursor = new THREE.Vector2();

    this.defaultCameraSpeed = 100; // camera fly speed
    this.cameraSpeed = this.defaultCameraSpeed; // camera fly speed
    this.moveSpeed = 0.01; // distance moved per pixel

    this.initZoomField();

    // raytracing fields
    this.raycaster = new THREE.Raycaster();

    // holds the mouse/touch position in screen coordinates (x,y) => [-1, 1]
    this.cursorForRay = new THREE.Vector2();

    // holds the last hitten object from raycasting on click or mouseover
    this.hittenObject = undefined;

    // holds the last hitten connections from raycasting on mouseover
    this.hoveredConnections = [];

    // the units moved between a mouseDown/touchStart and mouseUp/TouchEnd
    this.unitsMoved = 0;

    // is needed to calculate delta
    this.lastMousePosition = {x: 0, y: 0};

    const pitch = -45;
    // transformation helper. need this to move on the ground
    this.camTransformObject = new THREE.Object3D();
    this.camTransformObject.position.set(10, 0, -10);
    this.camTransformObject.rotation.y = pitch * Math.PI / 180;

    this.directionToCam = this.camera.getPosition()
      .clone()
      .sub(new THREE.Vector3())
      .normalize();

    this.tooltip2DSubscribtion = tooltipStore.activeTooltip.subscribe(tooltip =>
      this.tooltip2DIsActive = tooltip ? true : false);
  }

  initZoomField() {
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

  switchStateIfNext() {
    const next = this.state.getNext(this.zoomLevel);
    if (next) {
      this.state.leave();
      this.state = next;
      this.state.enter();
    }
  }

  zoom(delta) {
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
    this.scene.onZoom({zoomLevel: newTargetZoomLevel});

    this.handleRayCasting();

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
    this.scene.onZoom({zoomLevel: this.targetZoomLevel});
  }

  doClick() {
    // if an object was found via raycasting, inform the scene
    this.scene.onObjectClicked(this.hittenObject, this.hoveredConnections);
  }

  flyToObject(obj) {
    const pos = obj.getComponent('position').getPosition();
    this.flyToPosition(pos.x, pos.z);
  }

  flyToPosition(x, z) {
    const transObj = this.camTransformObject;

    transObj.position.x = x;
    transObj.position.z = z;
    transObj.updateMatrixWorld();
  }

  move(dx, dy) {
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

  handleRayCasting() {
    if (this.tooltip2DIsActive) {
      currentTooltip.emit(null);
      this.hittenObject = null;
      return;
    }

    const hoveredConnections = this.hoveredConnections;
    const hittenOld = this.hittenObject;
    this.getObjectOnCursor();
    const hittenNew = this.hittenObject;

    // if there is actually not hittenOld but it was last frame
    if (!hittenNew && hittenOld) {
      hittenOld.parentSceneObject.onHighlight(false);

      // if there is a hittenOld object
    } else if (hittenNew) {
      // if this is a new hittenOld object
      if (hittenOld !== hittenNew) {
        // if the new differs from the old and the old is valid
        if (hittenOld) {
          hittenOld.parentSceneObject.onHighlight(false);
        }
        hittenNew.parentSceneObject.onHighlight(true);
      }
    }

    if (!hittenNew) {
      if (hoveredConnections.length > 0) {
        currentTooltip.emit(this.connectionTooltip);
        this.connectionTooltip.setHovered(hoveredConnections);
      } else {
        currentTooltip.emit(null);
      }
    }
  }

  getObjectOnCursor() {
    const scene = this.scene;
    const camera = this.camera.camera;
    if (!camera) {
      return;
    }

    const canvasStyle = scene.getHtmlContainer().style;

    // get the mouse/touch position in pixel coords
    const x = this.lastMousePosition.x;
    const y = this.lastMousePosition.y;

    // transform into screen space
    this.cursorForRay.x = (x / scene.width) * 2 - 1;
    this.cursorForRay.y = -(y / scene.height) * 2 + 1;

    // update raycaster
    this.raycaster.setFromCamera(this.cursorForRay, this.camera.camera);

    // find the hitten object
    this.hittenObject = scene.findObjectByRay(this.raycaster);

    // reset highlight for all hovered connections
    this.hoveredConnections.forEach(c => c.onHighlight(false));

    if (this.hittenObject) {
      if (canvasStyle.cursor !== 'pointer') {
        canvasStyle.cursor = 'pointer';
      }

    } else {
      this.hoveredConnections = allConnections.filter(connection => {
        const intersected = connection.intersects(this.raycaster);
        if (intersected) {
          connection.onHighlight(true);
        }
        return intersected;
      });

      if (canvasStyle.cursor !== 'default') {
        canvasStyle.cursor = 'default';
      }
    }
  }

  isHoveringObject() {
    return this.hittenObject;
  }

  update() {
    const dTime = time.getDeltaTime();
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
    } else if (delta.length() < 0.0001) {
      return;
    }

    // move to target position with cameraspeed in units/sec
    cam.getPosition().sub(delta);
    cam.updateMatrix();
    this.scene.renderScene();
  }

  switchStateIfNext(zoomLevel) {
    const next = this.state.getNext(zoomLevel);
    if (next) {
      this.state.leave();
      this.state = next;
      this.state.enter();
    }
  }

  updateZoomLevel(dT) {
    const scene = this.scene;
    const cursorPosition = this.cursorForRay;
    const delta = this.targetZoomLevel - this.zoomLevel;

    this.zoomLevel += delta * dT * this.zoomSpeed;
    this.switchStateIfNext(this.zoomLevel);

    // get the position of the point in world space where the mouse is pointing at
    // and before the camera zoomed in
    cursorPosition.x = (this.lastMousePosition.x / scene.width) * 2 - 1; // [-1, 1]
    cursorPosition.y = -(this.lastMousePosition.y / scene.height) * 2 + 1; // [-1, 1]
    const pointOfImpact = this.getPointOfImpact(cursorPosition);

    // change camera size for zoom effect
    this.map.camera.cameraSize = this.zoomLevel / 10;
    this.map.camera.setCameraFromSize();

    if (!pointOfImpact) {
      return;
    }

    this.camera.updateProjectionMatrix();

    // get the new screenPosition of the impact point so that you can calculate the delta in screen space
    const pointOfImpactNew = this.getPointOfImpact(cursorPosition, scene);
    const transObj = this.camTransformObject;
    transObj.position.x += pointOfImpact.x - pointOfImpactNew.x;
    transObj.position.z += pointOfImpact.z - pointOfImpactNew.z;
    transObj.updateMatrixWorld();
  }

  getPointOfImpact(mousePos) {
    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(mousePos, this.camera.camera);

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects([this.map.ground]);
    if (intersects.length >= 1) {
      return intersects[0].point;
    }
  }

  dispose() {
    this.tooltip2DSubscribtion.dispose();
    this.tooltip2DSubscribtion = null;

    this.states = null;
    this.state = null;
    this.connectionTooltip.dispose();
  }
}

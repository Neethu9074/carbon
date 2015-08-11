import THREE from 'three';

import * as time from '../timeCalculations';
import {setupStates} from './States/index';
import {allConnections} from '../sceneObjects/Connection/index';
import {currentTooltip} from '../stores/mapStore';
import ConnectionTooltip from '../sceneObjects/Tooltips/Connection';

export default class CameraController {

  constructor({scene}) {
    this.bindListeners();
    this.init(scene);

    this.setZoomLevel(250);
    this.states = setupStates(this);
    this.state = this.states.near;
    this.connectionTooltip = new ConnectionTooltip(scene, []);
  }

  bindListeners() {
    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
    this.zoom = this.zoom.bind(this);
  }

  init(scene) {
    this.scene = scene;

    //holds the mouse/touch position in pixel coordinates
    this.cursor = new THREE.Vector2();

    this.cameraSpeed = 10; //camera fly speed
    this.moveSpeed = 0.01; //distance moved per pixel

    this.initZoomField();

    //raytracing fields
    this.raycaster = new THREE.Raycaster();

    //holds the mouse/touch position in screen coordinates (x,y) => [-1, 1]
    this.cursorForRay = new THREE.Vector2();

    //holds the last hitten object from raycasting on click or mouseover
    this.hittenObject = undefined;

    //holds the last hitten connections from raycasting on mouseover
    this.hoveredConnections = [];

    //the units moved between a mouseDown/touchStart and mouseUp/TouchEnd
    this.unitsMoved = 0;

    //is needed to calculate delta
    this.lastMousePosition = {x: 0, y: 0};

    const pitch = -45;
    //transformation helper. need this to move on the ground
    this.camTransformObject = new THREE.Object3D();
    this.camTransformObject.position.set(10, 0, -10);
    this.camTransformObject.rotation.y = pitch * Math.PI / 180;
    scene.addSceneObject(this.camTransformObject);

    this.directionToCam = scene.camera.position
      .clone()
      .sub(new THREE.Vector3())
      .normalize();
  }

  initZoomField() {
    //zoom fields
    this.maxZoomOut = 1800;
    this.normalZoomOut = 400; //100%
    this.maxZoomIn = 20;

    //the current Level of zooming
    this.zoomLevel = 250;

    //the wished level of zooming
    this.targetZoomLevel = 100;

    this.zoomSpeed = 10;
    this.scrollSpeed = 5;
  }

  switchStateIfNext() {
    const next = this.state.getNext(this.zoomLevel);
    if(next){
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
    const nZoomLevel = this.zoomLevel / (min - max);

    delta *= nZoomLevel * this.scrollSpeed;

    this.switchStateIfNext();

    this.targetZoomLevel -= delta;

    //[min, max]
    this.targetZoomLevel = Math.max(max, Math.min(min, (this.targetZoomLevel)));
    this.scene.onZoom({zoomLevel: this.targetZoomLevel});
  }

  setZoomLevel(zL) {
    const min = this.maxZoomOut;
    const max = this.maxZoomIn;

    this.targetZoomLevel = Math.max(max, Math.min(min, (zL)));
    this.scene.onZoom({zoomLevel: this.targetZoomLevel});
  }

  doClick() {
    //if an object was found via raycasting, inform the scene
    this.scene.onObjectClicked(this.hittenObject, this.hoveredConnections);
  }

  flyToObject(obj) {
    const transObj = this.camTransformObject;
    const pos = obj.getComponent('position').getPosition();

    transObj.position.x = pos.x;
    transObj.position.z = pos.z;
    transObj.updateMatrixWorld();
  }

  move(dx, dy) {
    //the pixels moved until last mouseDown / touchDown
    //set this before dx and dy gets manipulated
    this.unitsMoved += Math.sqrt(
      Math.pow(dx, 2) +
      Math.pow(dy, 2));

    const min = this.maxZoomOut;
    const max = this.maxZoomIn;

    //[0, 1] => [1, 11]
    const nZoomLevel = (this.zoomLevel / (min - max) * 10) + 1;
    dx *= nZoomLevel;
    dy *= nZoomLevel;

    const transObj = this.camTransformObject;
    transObj.translateX(-dx * this.moveSpeed);
    transObj.translateZ(-dy * this.moveSpeed);

    transObj.updateMatrixWorld();

    //TODO: clamp the position to avoid overflow of the level area
  }

  handleRayCasting() {
    const hittenOld = this.hittenObject;
    const hoveredConnections = this.hoveredConnections;
    this.getObjectOnCursor();
    const hittenNew = this.hittenObject;

    //if there is actually not hittenOld but it was last frame
    if(!hittenNew && hittenOld) {
      hittenOld.parentSceneObject.onHighlight(false);

      //if there is a hittenOld object
    } else if(hittenNew) {
      //if this is a new hittenOld object
      if(hittenOld !== hittenNew) {
        //if the new differs from the old and the old is valid
        if(hittenOld) {
          hittenOld.parentSceneObject.onHighlight(false);
        }
        hittenNew.parentSceneObject.onHighlight(true);
      }
    }

    if(!hittenNew) {
      if(hoveredConnections.length > 0) {
        currentTooltip.emit(this.connectionTooltip);
        this.connectionTooltip.setHovered(hoveredConnections);
      } else {
        currentTooltip.emit(null);
      }
    }
  }

  getObjectOnCursor() {
    const scene = this.scene;
    const canvasStyle = scene.getHtmlContainer().style;

    //get the mouse/touch position in pixel coords
    const x = this.lastMousePosition.x;
    const y = this.lastMousePosition.y;

    //transform into screen space
    this.cursorForRay.x = (x / scene.width) * 2 - 1;
    this.cursorForRay.y = -(y / scene.height) * 2 + 1;

    //update raycaster
    this.raycaster.setFromCamera(this.cursorForRay, scene.camera);

    //find the hitten object
    this.hittenObject = scene.findObjectByRay(this.raycaster);

    if(this.hittenObject) {
      if(canvasStyle.cursor !== 'pointer') {
        canvasStyle.cursor = 'pointer';
      }
    } else {
      this.hoveredConnections = allConnections
            .filter(connection => connection.isSelected())
            .filter(connection => connection.intersects(this.raycaster));
      if(canvasStyle.cursor !== 'default') {
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

    const cam = this.scene.camera;
    const targetWorldPos = new THREE.Vector3();

    targetWorldPos
      .applyMatrix4(this.camTransformObject.matrixWorld)
      .add(this.directionToCam
        .clone()
        .multiplyScalar(this.zoomLevel));

    //calculate the delta between wanted position and current position
    const direction = cam.position
      .clone()
      .sub(targetWorldPos);

    //get the total distance from the camera position to target position
    const distance = direction.length();

    //camera can only move this direction in units/sec (dTime => 1 / sec)
    const delta = direction.clone().multiplyScalar(dTime * this.cameraSpeed);

    // this.worldLookAtPos = new THREE.Vector3()
    //   .applyMatrix4(this.camTransformObject.matrixWorld)
    //   .add(direction);

    //if the distance after multiplication is bigger than the total distance
    //set it to total distance
    if(delta.length() > distance) {
      delta.normalize().multiplyScalar(distance);
    } else if(delta.length() < 0.0001) {
      return;
    }

    //move to target position with cameraspeed in units/sec
    cam.position.sub(delta);
    cam.updateMatrix();
    this.scene.renderScene();
  }

  updateZoomLevel(dT) {
    const delta = this.targetZoomLevel - this.zoomLevel;

    this.zoomLevel += delta * dT * this.zoomSpeed;
    this.scene.cameraSize = this.zoomLevel / 10;
    this.scene.setCameraFromSize();
  }
}

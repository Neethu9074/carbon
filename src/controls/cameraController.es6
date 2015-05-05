'use strict';

import THREE from 'three';


export default class CameraController {

  constructor({scene}) {
    this.bindListeners();
    this.init(scene);
  }

  bindListeners() {
    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
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

    //the units moved between a mouseDown/touchStart and mouseUp/TouchEnd
    this.unitsMoved = 0;

    const pitch = -45;
    //transformation helper. need this to move on the ground
    this.camTransformObject = new THREE.Object3D();
    this.camTransformObject.rotation.y = pitch * Math.PI / 180;
    scene.addSceneObject(this.camTransformObject);

    this.directionToCam = scene.camera.position
      .clone()
      .sub(new THREE.Vector3())
      .normalize();
  }

  initZoomField() {
    //zoom fields
    this.maxZoomOut = 3000;
    this.maxZoomIn = 20;
    this.zoomLevel = 100;
    this.zoomSpeed = 5;
  }

  zoom(delta) {
    if (delta === 0) {
      return;
    }
    const min = this.maxZoomOut;
    const max = this.maxZoomIn;

    const nZoomLevel = this.zoomLevel / (min - max);
    delta *= nZoomLevel * this.zoomSpeed;

    this.zoomLevel -= delta;
    //[min, max]
    this.zoomLevel = Math.max(max, Math.min(min, (this.zoomLevel)));
    this.scene.onZoom({zoomLevel: this.zoomLevel});
  }

  doClick() {
    //if an object was found via raycasting, inform the scene
    if (this.hittenObject !== undefined) {
      this.scene.clickedOnObject(this.hittenObject);
    }
  }

  flyToObject(obj) {
    obj.updateMatrixWorld();

    const targetPosition = new THREE.Vector3().applyMatrix4(obj.matrixWorld);

    const transObj = this.camTransformObject;
    transObj.position.x = targetPosition.x;
    transObj.position.z = targetPosition.z;
    transObj.updateMatrixWorld();
  }

  setZoomLevel(zL) {
    this.zoomLevel = Math.max(this.maxZoomIn, Math.min(this.maxZoomOut, (zL)));
    this.scene.onZoom({zoomLevel: this.zoomLevel});
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

    //clamp the position to avoid overflow of the level area
    //TODO: calculate the bounding box of all cubes inside the scene
    //(remember to update it) and set the bounds to that
  }

  getObjectOnCursor() {
    const scene = this.scene;

    //get the mouse/touch position in pixel coords
    const x = this.cursor.x;
    const y = this.cursor.y;

    //transform into screen space
    this.cursorForRay.x = (x / scene.width) * 2 - 1;
    this.cursorForRay.y = -(y / scene.height) * 2 + 1;

    //update raycaster
    this.raycaster.setFromCamera(this.cursorForRay, scene.camera);

    //find the hitten object
    this.hittenObject = scene.findObjectByRay(this.raycaster);
  }

  update(dTime) {
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
}

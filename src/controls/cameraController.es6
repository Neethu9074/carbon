'use strict';

import THREE from 'three';


//see: https://github.com/instana/visualization/
//commit/2a09db973b63cfbfa22b1b94769c0ca5c887628b/
//src/images/scetches/mouseControl.png
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
    this.moveSpeed = 0.025; //distance moved per pixel
    this.zoomSpeed = 5;

    //zoom fields
    this.maxZoomOut = 1000;
    this.maxZoomIn = 20;
    this.zoomLevel = 150;

    //raytracing fields
    this.raycaster = new THREE.Raycaster();

    //holds the mouse/touch position in screen coordinates (x,y) => [-1, 1]
    this.mouseForRay = new THREE.Vector2();

    //holds the last hitten object from raycasting on click or mouseover
    this.hittenObject = undefined;

    //the units moved between a mouseDown/touchStart and mouseUp/TouchEnd
    this.unitsMoved = 0;

    const pitch = -45;
    const yaw = -45;
    //transformation helper. need this to move on the ground
    this.camTransformObject = new THREE.Object3D();
    this.camTransformObject.rotation.y = pitch * Math.PI / 180;
    scene.addSceneObject(this.camTransformObject);

    this.directionHelper = new THREE.Object3D();
    this.directionHelper.rotation.x = yaw * Math.PI / 180;
    this.camTransformObject.add(this.directionHelper);

    this.targetCamPosition = new THREE.Object3D();
    this.targetCamPosition.translateZ(20);
    this.directionHelper.add(this.targetCamPosition);
  }

  zoom(delta) {
    const min = this.maxZoomOut;
    const max = this.maxZoomIn;

    const nZoomLevel = this.zoomLevel / (min - max);
    delta *= nZoomLevel * this.zoomSpeed;

    this.zoomLevel -= delta;
    //[min, max]
    this.zoomLevel = Math.max(max, Math.min(min, (this.zoomLevel)));
  }

  doClick() {
    if (this.hittenObject !== undefined) {
      //clicked on object!
      const targetPosition = this.hittenObject.position;
      this.camTransformObject.position.x = targetPosition.x;
      this.camTransformObject.position.z = targetPosition.z;
    }

    this.scene.clickedOnObject(this.hittenObject);
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

    //clamp the position to avoid overflow of the level area
    //TODO: calculate the bounding box of all cubes inside the scene
    //(remember to update it) and set the bounds to that
    transObj.position.x = Math.max(-500, transObj.position.x);
    transObj.position.x = Math.min(500, transObj.position.x);
    transObj.position.z = Math.min(500, transObj.position.z);
    transObj.position.z = Math.max(-500, transObj.position.z);
  }

  doRayPicking() {
    const scene = this.scene;

    //get the mouse/touch position in pixel coords
    const x = this.cursor.x;
    const y = this.cursor.y;

    //trnasform into screen coords
    this.mouseForRay.x = (x / scene.width) * 2 - 1;
    this.mouseForRay.y = -(y / scene.height) * 2 + 1;

    //update cameras world matrix to get the correct pos/rotation
    scene.camera.updateMatrixWorld();

    //update raycaster
    this.raycaster.setFromCamera(this.mouseForRay, scene.camera);

    //find the hitten object
    let obj = scene.findObjectInOctree(this.raycaster);
		if (obj !== undefined) {
			obj = obj.parentSceneObject;
			obj.setHighlight(true);

			if(obj !== this.hittenObject && this.hittenObject !== undefined) {
				this.hittenObject.setHighlight(false);
			}
		} else {
			if(this.hittenObject !== undefined) {
				this.hittenObject.setHighlight(false);
			}
		}
		this.hittenObject = obj;
  }

  update(dTime) {
    const cam = this.scene.camera;

    //this.targetCamPosition.position.set(0, 0, 0);
    //this.targetCamPosition.translateZ(this.zoomLevel);

    //.updateMatrixWorld(); is called via update loop
    const targetWorldPos = new THREE.Vector3();
    targetWorldPos.applyMatrix4(this.targetCamPosition.matrixWorld);

    //calculate the delta between wanted position and current position
    const delta = cam.position.clone();
    delta.sub(targetWorldPos);

    //apply position
    cam.position.sub(delta.multiplyScalar(dTime * this.cameraSpeed));
  }
}

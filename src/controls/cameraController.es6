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

    this.cameraSpeed = 10; //mainCamera fly speed - heuristic
    this.cameraLookAtSpeed = 30;
    this.moveSpeed = 0.025; //distance moved per pixel - heuristic
    this.zoomSpeed = 5;

    //zoom fields
    this.maxZoomOut = 1500;
    this.maxZoomIn = 20;
    this.zoomLevel = 150;
    this.beginToRotate = 40; //the distance where camera begins to slope

    //raytracing fields
    this.raycaster = new THREE.Raycaster();

    //holds the mouse/touch position in screen coordinates (x,y) => [-1, 1]
    this.mouseForRay = new THREE.Vector2();

    //holds the last hitten object from raycasting on click or mouseover
    this.hittenObject = undefined;

    this.leftMouseButtonIsPressed = false;

    //the units moved between a mouseDown/touchStart and mouseUp/TouchEnd
    this.unitsMoved = 0;

    const pitch = -25;
    const yaw = -55;
    //transformation helper. need this to move on the ground
    this.camTransformObject = new THREE.Object3D();
    this.camTransformObject.rotation.y = pitch * Math.PI / 180;
    scene.addSceneObject(this.camTransformObject);

    this.camTransformTranslatedObject = new THREE.Object3D();
    this.camTransformObject.add(this.camTransformTranslatedObject);

    this.directionHelper = new THREE.Object3D();
    this.directionHelper.position.copy(this.camTransformObject.position);
    this.directionHelper.rotation.x = yaw * Math.PI / 180;
    this.camTransformTranslatedObject.add(this.directionHelper);

    this.targetCamPosition = new THREE.Object3D();
    this.targetCamPosition.translateZ(30);
    this.directionHelper.add(this.targetCamPosition);

    this.lookAt = new THREE.Object3D();


    //.updateMatrixWorld(); is called via update loop
    //update all object of the hierarchy beginning with the parent
    const targetWorldPos = new THREE.Vector3();
    this.camTransformObject.updateMatrixWorld();
    this.camTransformTranslatedObject.updateMatrixWorld();
    this.directionHelper.updateMatrixWorld();
    this.targetCamPosition.updateMatrixWorld();
    targetWorldPos.applyMatrix4(this.targetCamPosition.matrixWorld);
    const cam = scene.camera;
    cam.position.copy(targetWorldPos);
    cam.lookAt(this.lookAt.position);

    cam.updateMatrixWorld();
    this.lookAt.rotation.copy(cam.rotation);

    if (__DEV__) {
      this.camTransformObject.add( new THREE.AxisHelper( 3 ) );
      this.directionHelper.add( new THREE.AxisHelper( 3 ) );
      this.targetCamPosition.add( new THREE.AxisHelper( 3 ) );
      this.camTransformTranslatedObject.add( new THREE.AxisHelper( 3 ) );
    }

    //color, intensity, range
    const light = new THREE.PointLight(0x666666, 5.5, 150);
    light.position.set(0, 12, 0);
    this.camTransformObject.add(light);
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
    //apply flatten effect
    let angleFactor = 1 -
      (this.zoomLevel - this.maxZoomIn) /
      (this.beginToRotate - this.maxZoomIn);

    const targetAngleNorm = Math.max(Math.min(1, angleFactor), 0); //[0, 1]
    const cam = this.scene.camera;

    this.targetCamPosition.position.set(0, 0, 0);
    this.targetCamPosition.translateZ(this.zoomLevel);

    this.camTransformTranslatedObject.position.set(0, 0, 0);
    this.camTransformTranslatedObject.translateZ(targetAngleNorm * 5);


    //.updateMatrixWorld(); is called via update loop
    const targetWorldPos = new THREE.Vector3();
    targetWorldPos.applyMatrix4(this.targetCamPosition.matrixWorld);

    //calculate the delta between wanted position and current position
    const delta = cam.position.clone();
    delta.sub(targetWorldPos);
    //apply position
    cam.position.sub(delta.clone().multiplyScalar(dTime * this.cameraSpeed));

    //calculate rotation (lookAt position)
    const deltaLookAt = this.camTransformObject.position.clone();
    deltaLookAt.sub(this.lookAt.position);
    let toMove = deltaLookAt
      .clone()
      .multiplyScalar(dTime * this.cameraLookAtSpeed);

    //avoid to go beyond the target position (happens on low FPS, when
    //dTime grows)
    if(toMove.length() > deltaLookAt.length()) {
      toMove = deltaLookAt;
    }

    this.lookAt.position.copy(cam.position);
    this.lookAt.translateZ(-this.zoomLevel);

    //apply rotation
    cam.lookAt(this.lookAt.position);
  }
}

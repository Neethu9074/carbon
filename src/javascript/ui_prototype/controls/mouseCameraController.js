'use strict';

import THREE from 'three.js';

import * as math from '../math';
import * as App from '../app';

//see: https://github.com/instana/visualization/
//commit/2a09db973b63cfbfa22b1b94769c0ca5c887628b/
//src/images/scetches/mouseControl.png
class MouseControl {
  constructor() {
    const app = App.getApplication();
    this.bindListeners();
    this.init(app);

    app.canvas.addEventListener('mousedown', this.onMouseDown);
    //app.canvas.addEventListener('touchstart', this.onMouseDown);

    app.canvas.addEventListener('mousemove', this.onMouseMove);
    //app.canvas.addEventListener('touchmove', this.onMouseMove);

    app.canvas.addEventListener('mouseup', this.onMouseUp);
    //app.canvas.addEventListener('touchend', this.onMouseUp);

    // IE9, Chrome, Safari, Opera
    app.canvas.addEventListener('mousewheel', this.onMouseWheel, false);
    // Firefox
    app.canvas.addEventListener('DOMMouseScroll', this.onMouseWheel, false);
  }

  bindListeners() {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
  }

  init(app) {
    this.appReference = app;
    this.mouse = new THREE.Vector2();
    this.cameraSpeed = 10; //mainCamera fly speed - heuristic
    this.moveSpeed = 0.1; //distance moved per pixel - heuristic

    //zoom fields
    this.maxZoomOut = 1500;
    this.maxZoomIn = 10;
    this.zoomLevel = 150;
    this.beginToRotate = 40;

    //raytracing fields
    this.raycaster = new THREE.Raycaster();
    this.counterForRayCasting = 0;
    this.mouseForRay = new THREE.Vector2();
    this.hittenObject = undefined;
    this.timeOnMouseDown = Date.now();


    const pitch = -25;
    const yaw = -55;
    //transformation helper. need this to move on the ground
    this.camTransformObject = new THREE.Object3D();
    this.camTransformObject.rotation.y = pitch * math.DegToRad;
    app.scene.add(this.camTransformObject);

    this.camTransformTranslatedObject = new THREE.Object3D();
    this.camTransformObject.add(this.camTransformTranslatedObject);

    this.directionHelper = new THREE.Object3D();
    this.directionHelper.position.copy(this.camTransformObject.position);
    this.directionHelper.rotation.x = yaw * math.DegToRad;
    this.camTransformTranslatedObject.add(this.directionHelper);

    this.targetCamPosition = new THREE.Object3D();
    this.targetCamPosition.translateZ(30);
    this.directionHelper.add(this.targetCamPosition);

    this.lookAt = new THREE.Object3D();

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

  onMouseWheel(e) {
    e.preventDefault();
    e = window.event || e; // old IE support

    const delta = e.wheelDelta / 150;

    this.zoomLevel -= delta;
    const min = this.maxZoomOut,
      max = this.maxZoomIn;
    //[min, max]
    this.zoomLevel = Math.max(max, Math.min(min, (this.zoomLevel)));
  }

  onMouseDown(e) {
    e.preventDefault();
    if (e.button === 0) {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      //set the hitten object at the time, the mouse was pressed
      this.timeOnMouseDown = Date.now();
    }
  }

  onMouseUp(e) {
    e.preventDefault();
    const timeOnMouseUp = Date.now();
    const millisSinceMouseDown = timeOnMouseUp - this.timeOnMouseDown;
    if (millisSinceMouseDown < 250) {
      if (this.hittenObject !== undefined) {

        //clicked on object!
        const targetPosition = this.hittenObject.position;
        this.camTransformObject.position.x = targetPosition.x;
        this.camTransformObject.position.z = targetPosition.z;
      }

      this.appReference.clickedOnObject(this.hittenObject);
    }
  };

  onMouseMove(e) {
    e.preventDefault();
    //if left mouse button is pressed while dragging
    if (e.which === 1) {
      //calculate the delta between old (frame-1) and this position
      const dx = (e.clientX - this.mouse.x);
      const dy = (e.clientY - this.mouse.y);

      const transObj = this.camTransformObject;
      transObj.translateX(-dx * this.moveSpeed);
      transObj.translateZ(-dy * this.moveSpeed);
      //clamp the position to avoid overflow of the level area
      transObj.position.x = Math.max(-500, transObj.position.x);
      transObj.position.x = Math.min(500, transObj.position.x);
      transObj.position.z = Math.min(500, transObj.position.z);
      transObj.position.z = Math.max(-500, transObj.position.z);
    }

    //don't forget to set the new position :)
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  doRayPicking() {
    const app = this.appReference;
    const x = this.mouse.x;
    const y = this.mouse.y;

    this.mouseForRay.x = (x / app.width) * 2 - 1;
    this.mouseForRay.y = -(y / app.height) * 2 + 1;

    //update cameras world matrix
    app.mainCamera.updateMatrixWorld();
    //update raycaster
    this.raycaster.setFromCamera(this.mouseForRay, app.mainCamera);

    //find the hitten object
    let obj = app.findObjectInOctree(this.raycaster);
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
    //do it only every x times
    if ((this.counterForRayCasting++ % 5) === 0) {
      this.doRayPicking();
    }

    //apply flatten effect
    let angleFactor = 1 -
      (this.zoomLevel - this.maxZoomIn) /
      (this.beginToRotate - this.maxZoomIn);

    const targetAngleNorm = Math.max(Math.min(1, angleFactor), 0); //[0, 1]
    const cam = this.appReference.mainCamera;

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
    cam.position.sub(delta.multiplyScalar(dTime * this.cameraSpeed));


    //calculate rotation (lookAt position)
    const deltaLookAt = this.camTransformObject.position.clone();
    deltaLookAt.sub(this.lookAt.position);

    this.lookAt.position
      .add(deltaLookAt.multiplyScalar(dTime * this.cameraSpeed));

    this.lookAt.position.y = targetAngleNorm * 1;

    //apply rotation
    cam.lookAt(this.lookAt.position);
  }
}

export default MouseControl;

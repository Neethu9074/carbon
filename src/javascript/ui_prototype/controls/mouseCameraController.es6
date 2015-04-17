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
    app.canvas.addEventListener('touchstart', this.onTouchStart);

    app.canvas.addEventListener('mousemove', this.onMouseMove);
    app.canvas.addEventListener('touchmove', this.onTouchMove);

    app.canvas.addEventListener('mouseup', this.onMouseUp);
    app.canvas.addEventListener('touchend', this.onTouchEnd);
    app.canvas.addEventListener('mouseout', this.onMouseOut);

    // IE9, Chrome, Safari, Opera
    app.canvas.addEventListener('mousewheel', this.onMouseWheel, false);
    // Firefox
    app.canvas.addEventListener('DOMMouseScroll', this.onMozMouseWheel, false);
  }

  bindListeners() {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMozMouseWheel = this.onMozMouseWheel.bind(this);
  }

  init(app) {
    this.appReference = app;
    this.mouse = new THREE.Vector2();
    this.cameraSpeed = 10; //mainCamera fly speed - heuristic
    this.moveSpeed = 0.1; //distance moved per pixel - heuristic
    this.pitchSpeed = 0.4;

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

    this.leftMouseButtonIsPressed = false;
    this.unitsMoved = 0;
    this.lastDistance = 0;

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

    this.zoom(e.wheelDelta / 50);
  }

  onMozMouseWheel(e) {
    e.preventDefault();

    this.zoom(-e.detail);
  }

  zoom(delta) {
    const min = this.maxZoomOut;
    const max = this.maxZoomIn;

    const nZoomLevel = this.zoomLevel / (min - max) * 5;
    delta *= nZoomLevel;

    this.zoomLevel -= delta;
    //[min, max]
    this.zoomLevel = Math.max(max, Math.min(min, (this.zoomLevel)));
  }

  onMouseDown(e) {
    e.preventDefault();
    if (e.button === 0) {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      this.pixelMoved = 0;

      //save the state for mouse move
      this.leftMouseButtonIsPressed = true;
    }
  }

  onMouseOut() {
    //reset the state when mouse left the map
    //this.leftMouseButtonIsPressed = false;
  }

  onMouseUp(e) {
    e.preventDefault();

    if (this.unitsMoved < 100) {
      this.doClick();
    }

    if(e.button === 0) {
      //save the state for mouse move
      this.leftMouseButtonIsPressed = false;
      this.unitsMoved = 0;
    }
  };

  doClick() {
    if (this.hittenObject !== undefined) {

      //clicked on object!
      const targetPosition = this.hittenObject.position;
      this.camTransformObject.position.x = targetPosition.x;
      this.camTransformObject.position.z = targetPosition.z;
    }

    this.appReference.clickedOnObject(this.hittenObject);
  }

  onMouseMove(e) {
    e.preventDefault();
    //if left mouse button is pressed while dragging
    if (this.leftMouseButtonIsPressed) {
      //calculate the delta between old (frame-1) and this position
      const dx = (e.clientX - this.mouse.x);
      const dy = (e.clientY - this.mouse.y);
      this.move(dx, dy);
    }

    //don't forget to set the new position :)
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  move(dx, dy) {
    const min = this.maxZoomOut;
    const max = this.maxZoomIn;

    const nZoomLevel = (this.zoomLevel / (min - max) * 10) + 1;
    dx *= nZoomLevel;
    dy *= nZoomLevel;

    const transObj = this.camTransformObject;
    transObj.translateX(-dx * this.moveSpeed);
    transObj.translateZ(-dy * this.moveSpeed);
    //clamp the position to avoid overflow of the level area
    transObj.position.x = Math.max(-500, transObj.position.x);
    transObj.position.x = Math.min(500, transObj.position.x);
    transObj.position.z = Math.min(500, transObj.position.z);
    transObj.position.z = Math.max(-500, transObj.position.z);

    //the pixels moved until last mouseDown / touchDown
    this.unitsMoved += Math.sqrt(
      Math.pow(dx, 2) +
      Math.pow(dy, 2));
  }

  onTouchStart(e) {
    e.preventDefault();
    this.unitsMoved = 0;

    if(e.touches.length === 2) {
      this.scaling = true;
    } else {
      this.touchDown = true;
    }

    this.mouse.x = e.touches[0].clientX;
    this.mouse.y = e.touches[0].clientY;
  }

  onTouchEnd(e) {
    e.preventDefault();
    this.touchDown = false;

    if(this.scaling) {
      this.scaling = false;
    } else {
      if (this.unitsMoved < 100) {
        this.doClick();
      }
    }

    this.lastDistance = 0;
    this.unitsMoved = 0;
  }

  onTouchMove(e) {
		e.stopPropagation();
    e.preventDefault();

    if(this.scaling) {
      const dist = Math.sqrt(
        Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
        Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2));

      if(this.lastDistance === 0) {
        this.lastDistance = dist;
      }

      const delta = this.lastDistance - dist;
      this.zoom(delta * this.pitchSpeed);
      this.lastDistance = dist;

    } else {
      this.lastDistance = 0;
      if(this.touchDown) {
        //calculate the delta between old (frame-1) and this position
        const dx = (e.touches[0].clientX - this.mouse.x);
        const dy = (e.touches[0].clientY - this.mouse.y);

        this.move(dx, dy);
      }
    }

    this.mouse.x = e.touches[0].clientX;
    this.mouse.y = e.touches[0].clientY;
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

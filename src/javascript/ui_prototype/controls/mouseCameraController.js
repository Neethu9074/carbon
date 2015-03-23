'use strict';

import THREE from 'three.js';

class MouseControl {
  constructor(app) {
    this.bindListeners();
    this.init(app);

    app.canvas.addEventListener('mousedown', this.onMouseDown);
    app.canvas.addEventListener('mousemove', this.onMouseMove);
    app.canvas.addEventListener('mouseup', this.onMouseUp);

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
    this.cameraSpeed = 5; //mainCamera fly speed - heuristic
    this.moveSpeed = 0.06; //distance moved per pixel - heuristic

    this.alreadyRotated = 0;
    this.maxRotate = 20;

    //zoom fields
    this.minZoom = 1000;
    this.zoomLevel = 100;
    this.beginToRotate = 40;
    this.maxZoom = 10;

    //raytracing fields
    this.raycaster = new THREE.Raycaster();
    this.counterForRayCasting = 0;
    this.mouseForRay = new THREE.Vector2();
    this.hittenObject = undefined;
    this.hittenOnMouseDown = undefined;
    this.timeOnMouseDown = Date.now();


    //transformation helper
    //need this to move on the ground
    this.camTransformObject = new THREE.Object3D();
    this.camTransformObject.rotateOnAxis(
      new THREE.Vector3(0, 1, 0), app.mainCamera.rotation.y);

    this.directionHelper = new THREE.Object3D();
    this.directionHelper.rotation.copy(app.mainCamera.rotation);

    app.scene.add(this.camTransformObject);

    //color, intensity, range
    const light = new THREE.PointLight(0x666666, 5.5, 150);
    light.position.set(0, 10, 0);
    this.camTransformObject.add(light);
  }

  onMouseWheel(e) {
    e.preventDefault();
    e = window.event || e; // old IE support

    const delta = e.wheelDelta / 150;

    this.zoomLevel -= delta;
    const min = this.minZoom,
      max = this.maxZoom;
    //[min, max]
    this.zoomLevel = Math.max(max, Math.min(min, (this.zoomLevel)));
  }

  onMouseDown(e) {
    e.preventDefault();
    if (e.button === 0) {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      //set the hitten object at the time, the mouse was pressed
      this.hittenOnMouseDown = this.hittenObject;
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
        const targetPosition = this.hittenObject.getWorldPos();
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
      transObj.position.x = Math.max(-25, transObj.position.x);
      transObj.position.x = Math.min(250, transObj.position.x);
      transObj.position.z = Math.min(25, transObj.position.z);
      transObj.position.z = Math.max(-250, transObj.position.z);
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

    const cam = this.appReference.mainCamera;

    this.directionHelper.position.copy(this.camTransformObject.position);
    this.directionHelper.translateZ(this.zoomLevel);

    //calculate the delta between wanted position and current position
    const delta = new THREE.Vector3(
      cam.position.x,
      cam.position.y,
      cam.position.z);

    //get the delta
    delta.sub(this.directionHelper.position);

    cam.position.sub(delta.multiplyScalar(dTime * this.cameraSpeed));

    return;
    //leads to artefacts when switching the tabs
    /*
		//apply rotation
		const angleFactor = 1 -
			(cam.position.y - this.maxZoom) /
			(this.beginToRotate - this.maxZoom);

		angleFactor = Math.max(Math.min(1, angleFactor), 0); //[0, 1]

		const targetAngle = (angleFactor * this.maxRotate * Math.PI / 180)
			- this.alreadyRotated;
		cam.rotateOnAxis(
			new THREE.Vector3(1, 0, 0), targetAngle * dTime * 5);
		this.alreadyRotated += targetAngle * dTime * 5;
		*/
  }
}

export default MouseControl;

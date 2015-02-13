'use strict';

var THREE = require('three.js');
var colors = require('../colors');

exports.MouseControl = function MouseControl(app) {
  this.bindListeners();
  this.init(app);

  app.container.addEventListener('mousedown', this.onMouseDown);
  app.container.addEventListener('mousemove', this.onMouseMove);
  app.container.addEventListener('mouseup', this.onMouseUp);

  // IE9, Chrome, Safari, Opera
  app.container.addEventListener('mousewheel', this.onMouseWheel, false);
  // Firefox
  app.container.addEventListener('DOMMouseScroll', this.onMouseWheel, false);

  document.body.addEventListener('keydown', this.keydown);
};

//this is for notebook use beacause i don't have any scroll wheel -.-
exports.MouseControl.prototype.keydown = function(e) {
  var delta = 0;
  if (e.keyCode === 38) {
    delta = 1;
  }
  if (e.keyCode === 40) {
    delta = -1;
  }
  this.appReference.zoom(delta);
  this.zoomDistance = this.appReference.zoomLevel.distance;
};

exports.MouseControl.prototype.init = function(app) {
  this.appReference = app;
  this.mouse = new THREE.Vector2();
  this.cameraSpeed = 5; //camera fly speed - heuristic
  this.moveSpeed = 0.06; //distance moved per pixel - heuristic

  //zoom fields
  this.zoomDistance = app.zoomLevel.distance;
  this.targetZoomDistance = this.zoomDistance;

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
    new THREE.Vector3(0, 1, 0), app.camera.rotation.y);

  this.directionHelper = new THREE.Object3D();
  this.directionHelper.rotation.copy(app.camera.rotation);

  // a debug axis to see, where camera is transformed with
  this.camTransformObject.add(new THREE.AxisHelper(2));
  this.directionHelper.add(new THREE.AxisHelper(1));

  app.scene.add(this.camTransformObject);
  app.scene.add(this.directionHelper);

  var light = new THREE.PointLight( colors.midBlue, 4.5, 100 );
  light.position.set( 0, 15, 0 );
  this.camTransformObject.add(light);
};

exports.MouseControl.prototype.bindListeners = function() {
  this.onMouseMove = this.onMouseMove.bind(this);
  this.onMouseDown = this.onMouseDown.bind(this);
  this.onMouseUp = this.onMouseUp.bind(this);
  this.init = this.init.bind(this);
  this.update = this.update.bind(this);
  this.onMouseWheel = this.onMouseWheel.bind(this);
  this.keydown = this.keydown.bind(this);
};

exports.MouseControl.prototype.onMouseWheel = function(e) {
  e = window.event || e; // old IE support
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
  //scroll up -> delta = 1, -1 otherwise => {-1, 1}

  //cal the zoom method of main app
  this.appReference.zoom(delta);

  //now you can grap the new zoom object
  this.zoomDistance = this.appReference.zoomLevel.distance;
};

exports.MouseControl.prototype.onMouseDown = function(e) {
  if (e.button === 0) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;

    //set the hitten object at the time, the mouse was pressed
    this.hittenOnMouseDown = this.hittenObject;
    this.timeOnMouseDown = Date.now();
  }
};

exports.MouseControl.prototype.onMouseUp = function() {
  var timeOnMouseUp = Date.now();
  var millisSinceMouseDown = timeOnMouseUp - this.timeOnMouseDown;
  if (millisSinceMouseDown < 250 && //intervall to click
    this.hittenObject !== undefined) {
    //clicked on object!
    this.appReference.clickedOnObject(this.hittenObject);
    this.camTransformObject.position.x = this.hittenObject.position.x;
    this.camTransformObject.position.z = this.hittenObject.position.z;
  }
};

exports.MouseControl.prototype.onMouseMove = function(event) {
  //if left mouse button is pressed while dragging
  if (event.which === 1) {
    //calculate the delta between old (frame-1) and this position
    var dx = (event.clientX - this.mouse.x);
    var dy = (event.clientY - this.mouse.y);

    this.camTransformObject.translateX(-dx * this.moveSpeed);
    this.camTransformObject.translateZ(-dy * this.moveSpeed);

    //don't forget to set the new position :)
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  //do it only every x times, here y = 10
  if ((this.counterForRayCasting++ % 30) === 0) {
    this.doRayPicking();
  }
};

//TODO: extract method to single class?
//TODO: use octree for performance issues
exports.MouseControl.prototype.doRayPicking = function() {
  //do raypicking, when not draging and mouse moving
  var app = this.appReference;
  var width = app.container.offsetWidth;
  var height = app.container.offsetHeight;
  this.mouseForRay.x = (event.clientX / width) * 2 - 1;
  this.mouseForRay.y = -(event.clientY / height) * 2 + 1;

  //reset all materials
  for (var i = 0; i < app.collisionObjects.length; i++) {
    app.collisionObjects[i].material.visible = false;
  }

  //reset hitten object and calculate new
  this.hittenObject = undefined;

  //update camera world matrix
  app.camera.updateMatrixWorld();
  //set raycaster
  this.raycaster.setFromCamera(this.mouseForRay, app.camera);
  var intersects = this.raycaster.intersectObjects(app.collisionObjects, true);
  for (var intersect in intersects) {
    var obj = intersects[intersect];
    obj.object.material.visible = true;
    this.hittenObject = obj.object;
  }
};

exports.MouseControl.prototype.update = function(dTime) {
  var cam = this.appReference.camera;

  this.directionHelper.position.copy(this.camTransformObject.position);
  this.directionHelper.translateZ(this.zoomDistance);

  //calculate the delta between wanted position and current position
  var delta = new THREE.Vector3(
    cam.position.x,
    cam.position.y,
    cam.position.z);

  //get the delta
  delta.sub(this.directionHelper.position);

  cam.position.sub(
    delta.multiplyScalar(dTime * this.cameraSpeed));

  //TODO: clamp the position to avoid overflow of the level area
};

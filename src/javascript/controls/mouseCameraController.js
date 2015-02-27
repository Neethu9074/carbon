'use strict';

var THREE = require('three.js');
var colors = require('../colors');

exports.MouseControl = function MouseControl(app) {
  this.bindListeners();
  this.init(app);

  app.canvas.addEventListener('mousedown', this.onMouseDown);
  app.canvas.addEventListener('mousemove', this.onMouseMove);
  app.canvas.addEventListener('mouseup', this.onMouseUp);

  // IE9, Chrome, Safari, Opera
  app.canvas.addEventListener('mousewheel', this.onMouseWheel, false);
  // Firefox
  app.canvas.addEventListener('DOMMouseScroll', this.onMouseWheel, false);
};

exports.MouseControl.prototype.init = function(app) {
  this.appReference = app;
  this.mouse = new THREE.Vector2();
  this.cameraSpeed = 5; //mainCamera fly speed - heuristic
  this.moveSpeed = 0.06; //distance moved per pixel - heuristic

  //zoom fields
  this.minZoom = 1000;
  this.zoomLevel = 40;
  this.maxZoom = 6.5;

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

  // a debug axis to see, where mainCamera is transformed with
  this.camTransformObject.add(new THREE.AxisHelper(2));

  app.scene.add(this.camTransformObject);
  app.scene.add(this.directionHelper);

  //color, intensity, range
  var light = new THREE.PointLight( 0x666666, 5.5, 150 );
  light.position.set( 0, 10, 0 );
  this.camTransformObject.add(light);
};

exports.MouseControl.prototype.bindListeners = function() {
  this.onMouseMove = this.onMouseMove.bind(this);
  this.onMouseDown = this.onMouseDown.bind(this);
  this.onMouseUp = this.onMouseUp.bind(this);
  this.init = this.init.bind(this);
  this.update = this.update.bind(this);
  this.onMouseWheel = this.onMouseWheel.bind(this);
};

exports.MouseControl.prototype.onMouseWheel = function(e) {
  e.preventDefault();
  e = window.event || e; // old IE support

  var delta = e.wheelDelta / 150;

  this.zoomLevel -= delta;
  var min = this.minZoom, max = this.maxZoom;
  this.zoomLevel = Math.max(max, Math.min(min, (this.zoomLevel))); //[min, max]

  //cal the zoom method of main app
  this.appReference.zoom(this.zoomLevel);
};

exports.MouseControl.prototype.onMouseDown = function(e) {
  e.preventDefault();
  if (e.button === 0) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;

    //set the hitten object at the time, the mouse was pressed
    this.hittenOnMouseDown = this.hittenObject;
    this.timeOnMouseDown = Date.now();
  }
};

exports.MouseControl.prototype.onMouseUp = function(e) {
  e.preventDefault();
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

exports.MouseControl.prototype.onMouseMove = function(e) {
  e.preventDefault();
  //if left mouse button is pressed while dragging
  if (e.which === 1) {
    //calculate the delta between old (frame-1) and this position
    var dx = (e.clientX - this.mouse.x);
    var dy = (e.clientY - this.mouse.y);

    this.camTransformObject.translateX(-dx * this.moveSpeed);
    this.camTransformObject.translateZ(-dy * this.moveSpeed);

    //don't forget to set the new position :)
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  //do it only every x times
  if ((this.counterForRayCasting++ % 5) === 0) {
    this.doRayPicking( e.clientX,  e.clientY);
  }
};

//TODO: extract method to single class?
exports.MouseControl.prototype.doRayPicking = function(x, y) {
  var app = this.appReference;

  //update mainCamera world matrix
  app.mainCamera.updateMatrixWorld();

  var width = app.canvas.offsetWidth;
  var height = app.canvas.offsetHeight;
  this.mouseForRay.x = (x / width) * 2 - 1;
  this.mouseForRay.y = -(y / height) * 2 + 1;

  //update raycaster
  this.raycaster.setFromCamera(this.mouseForRay, app.mainCamera);

  //reset color of the last mouseover object
  if(this.hittenObject !== undefined){
    app.scene.remove(this.hittenObject);
  }

  //find the new object
  var obj = app.findObject(this.raycaster);
  if(obj !== undefined){
    app.scene.add(obj);
    this.hittenObject = obj;
  }
};

exports.MouseControl.prototype.update = function(dTime) {
  var cam = this.appReference.mainCamera;

  this.directionHelper.position.copy(this.camTransformObject.position);
  this.directionHelper.translateZ(this.zoomLevel);

  //calculate the delta between wanted position and current position
  var delta = new THREE.Vector3(
    cam.position.x,
    cam.position.y,
    cam.position.z);

  //get the delta
  delta.sub(this.directionHelper.position);

  cam.position.sub(delta.multiplyScalar(dTime * this.cameraSpeed));

  //TODO: clamp the position to avoid overflow of the level area
};

'use strict';

var THREE = require('three.js');
var math = require('../math');

exports.MouseControl = function MouseControl(app) {
  this.bindListeners();
  this.init(app);

  app.container.addEventListener('mousedown', this.onMouseDown);
  app.container.addEventListener('mousemove', this.onMouseMove);

  // IE9, Chrome, Safari, Opera
  app.container.addEventListener('mousewheel', this.onMouseWheel, false);
  // Firefox
  app.container.addEventListener('DOMMouseScroll', this.onMouseWheel, false);

  //jquery style
  //$(app.container).mousedown(this.onMouseDown);
  //$(app.container).mousemove(this.onMouseMove);
};

exports.MouseControl.prototype.init = function(app) {
  this.appRef = app;
  this.mouse = new THREE.Vector2();
  this.cameraSpeed = 5;
  this.moveSpeed = 0.01;
  this.drag = false;

  //zoom fields
  this.minZoomHeight = 3;
  this.maxZoomHeight = 10;
  this.zoomHeight = this.minZoomHeight;
  this.zoomSpeed = 0.4;
  this.zoomLevel = 0; //[0, 1]
  this.fogFar = this.appRef.scene.fog.far;

  //raytracing fields
  this.raycaster = new THREE.Raycaster();
  this.counterForRayCasting = 0;
  this.mouseForRay = new THREE.Vector2();

  var cam = app.cameraTransform;
  this.targetPositionObj = new THREE.Object3D();
  this.targetPositionObj.position.copy(cam.position);
  this.targetPositionObj.rotation.copy(cam.rotation);
  this.targetPositionObj.rotateOnAxis(
    new THREE.Vector3(1, 0, 0), 35 * math.DegToRad);
};

exports.MouseControl.prototype.bindListeners = function() {
  this.onMouseMove = this.onMouseMove.bind(this);
  this.onMouseDown = this.onMouseDown.bind(this);
  this.init = this.init.bind(this);
  this.update = this.update.bind(this);
  this.onMouseWheel = this.onMouseWheel.bind(this);
};

exports.MouseControl.prototype.onMouseWheel = function(e) {
  e = window.event || e; // old IE support
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
  //scroll up -> delta = 1, -1 otherwise

  this.zoomHeight -= delta * this.zoomSpeed;
  //clamp height between min and max distance
  this.zoomHeight = Math.max(this.minZoomHeight,		// [minHeight,
		Math.min(this.zoomHeight, this.maxZoomHeight)); //  maxHeight]


  //get a normalizedZoomLevel between [0=zoomedIn, 1=zoomedOut];
  this.zoomLevel = (this.zoomHeight - this.minZoomHeight) /
  (this.maxZoomHeight - this.minZoomHeight);

	//in/decrease fog distance to get a nicer result
  this.appRef.scene.fog.far = this.fogFar +
    (this.zoomHeight - this.minZoomHeight);
};

exports.MouseControl.prototype.onMouseDown = function(e) {
  if (e.button === 0) {
    this.drag = true;
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;

    //stop cam if clicked (user xp)
    this.targetPositionObj.position.copy(
      this.appRef.cameraTransform.position);
  }
};

exports.MouseControl.prototype.onMouseMove = function(event) {
  //if left mouse button is pressed while dragging
  if (event.which === 1) {
    //calculate the delta between old (frame-1) and this position
    var dx = (event.clientX - this.mouse.x);
    var dy = (event.clientY - this.mouse.y);

    this.targetPositionObj.translateX(-dx * this.moveSpeed);
    this.targetPositionObj.translateZ(-dy * this.moveSpeed);

    //don't forget to set the new position :)
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  } else {
    //do it only every x times, here y = 10
    if ((this.counterForRayCasting++ % 300) === 0) {
      this.doRayPicking();
    }
  }
};

exports.MouseControl.prototype.doRayPicking = function() {
  //do raypicking, when not draging and mouse moving
  var app = this.appRef;
  var width = app.container.offsetWidth;
  var height = app.container.offsetHeight;
  this.mouseForRay.x = (event.clientX / width) * 2 - 1;
  this.mouseForRay.y = -(event.clientY / height) * 2 + 1;

  //update camera worlld matrix
  app.camera.updateMatrixWorld();

  //set raycaster
  this.raycaster.setFromCamera(this.mouseForRay, app.camera);
  var intersects = this.raycaster.intersectObjects(app.scene.children, true);
  for (var intersect in intersects) {
    var obj = intersects[intersect];
    console.log(obj.object.name);
  }
};

exports.MouseControl.prototype.update = function(dTime) {
  var cam = this.appRef.camera;
  var camTransform = this.appRef.cameraTransform;
  var camTransPos = camTransform.position;

  //calculate the delta between wanted position and current position
  var delta = new THREE.Vector3(
    this.targetPositionObj.position.x,
    this.zoomHeight - this.minZoomHeight,
    this.targetPositionObj.position.z);

	//get the delta
  delta.sub(camTransPos);

	//TODO: clamp the position to avoid overflow of the level area

  camTransPos.add(delta.multiplyScalar(dTime * this.cameraSpeed));
  //obj now has the new position

  //the camera is (0, zoomHeight, 3) away from the transform handler
  //x and z will change due to cameraTransform
  //y will change due to zoom / scrolllevel
  camTransform.translateZ(3);
  cam.position.set(
    camTransPos.x,
    camTransPos.y + this.minZoomHeight,
    camTransPos.z);
  camTransform.translateZ(-3);

  var POI = camTransPos.clone();
  POI.y = 0;
  cam.lookAt(POI);
};

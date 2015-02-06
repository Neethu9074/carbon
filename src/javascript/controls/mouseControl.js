'use strict';

var THREE = require('three.js');
var math = require('../math');

exports.MouseControl = function MouseControl(app) {
  this.bindListeners();
  this.init(app);

  app.container.addEventListener('mousedown', this.onMouseDown);
  app.container.addEventListener('mousemove', this.onMouseMove);

  //$(app.container).mousedown(this.onMouseDown);
  //$(app.container).mousemove(this.onMouseMove);
};

exports.MouseControl.prototype.init = function(app) {
  this.appRef = app;
  this.mouse = new THREE.Vector2();
  this.cameraSpeed = 5;
  this.moveSpeed = 0.01;
  this.drag = false;

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
};

exports.MouseControl.prototype.onMouseDown = function(e) {
  if (e.button === 0) {
    this.drag = true;
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;

    //stop cam if clicked (user xp)
    this.targetPositionObj.position.copy(this.appRef.cameraTransform.position);
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

  //set raycaster
  this.raycaster.setFromCamera(this.mouseForRay, app.camera);
  var intersects = this.raycaster.intersectObjects(app.scene.children, true);
  for (var intersect in intersects) {
    var obj = intersects[intersect];
      console.log(obj.object.name);
  }
}

exports.MouseControl.prototype.update = function(dTime) {
  //calculate the delta between wanted position and current position
  var delta = new THREE.Vector3(
    this.targetPositionObj.position.x,
    this.targetPositionObj.position.y,
    this.targetPositionObj.position.z);

  delta.sub(this.appRef.cameraTransform.position);
  delta.y = 0; // do not animate y axis

  var obj = this.appRef.cameraTransform;
  obj.position.add(delta.multiplyScalar(dTime * this.cameraSpeed));
  //obj now has the new position

  //the camera is (0,3,3) away from the transform handler
  obj.translateZ(3);
  this.appRef.camera.position.set(
    obj.position.x,
    obj.position.y + 3,
    obj.position.z);
  obj.translateZ(-3);
};

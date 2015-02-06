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
	this.cam = app.cameraTransform;
	this.mouseX = 0;
	this.mouseY = 0;
	this.cameraSpeed = 5;
	this.moveSpeed = 0.01;
	this.drag = false;

	this.targetPositionObj = new THREE.Object3D();
	this.targetPositionObj.position.copy(this.cam.position);
	this.targetPositionObj.rotation.copy(this.cam.rotation);
	this.targetPositionObj.rotateOnAxis(new THREE.Vector3(1, 0, 0), 35 * math.DegToRad);
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
		this.mouseX = e.clientX;
		this.mouseY = e.clientY;

		//stop cam if clicked (user xp)
		this.targetPositionObj.position.copy(this.cam.position);
	}
};

exports.MouseControl.prototype.onMouseMove = function(e) {
	//if left mouse button is pressed while dragging
	if (e.which === 1) {
		//calculate the delta between old (frame-1) and this position
		var dx = (e.clientX - this.mouseX);
		var dy = (e.clientY - this.mouseY);

		this.targetPositionObj.translateX(-dx * this.moveSpeed);
		this.targetPositionObj.translateZ(-dy * this.moveSpeed);

		//don't forget to set the new position :)
		this.mouseX = e.clientX;
		this.mouseY = e.clientY;
	}
};

exports.MouseControl.prototype.update = function(dTime) {
	var delta = new THREE.Vector3(
		this.targetPositionObj.position.x,
		this.targetPositionObj.position.y,
		this.targetPositionObj.position.z);

	delta.sub(this.cam.position);
	delta.y = 0; // do not animate y axis

	this.cam.position.add(delta.multiplyScalar(dTime * this.cameraSpeed));
};

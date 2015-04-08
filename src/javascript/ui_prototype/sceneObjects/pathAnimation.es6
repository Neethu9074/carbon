/*
'use strict';

var THREE = require('three.js');

exports.PathAnimation = function PathAnimation(path) {
	//save reference for later use
	this.path = path;

	this.lerpPercentage = 0;
	this.index = 0;
	this.from = toVector3(path[0]);
	this.to = toVector3(path[1]);
  this.calculateSpeed();

	this.init();
};

exports.PathAnimation.prototype.init = function() {
	var startPos = this.from;

	var geometry = new THREE.SphereGeometry(0.25, 4, 4);
	var material = new THREE.MeshBasicMaterial({
		color: 0xffff00
	});
	var sphere = new THREE.Mesh(geometry, material);
	sphere.position.copy(startPos);
	sphere.lookAt(toVector3(this.to));

	this.mesh = sphere;
};

function toVector3(pathPoint) {
	return new THREE.Vector3(pathPoint[0], 0.1, -pathPoint[1]);
}

exports.PathAnimation.prototype.update = function(dTime) {
  //store 'locally' to give a better overview of the code
  var lerpFactor = this.lerpPercentage;
  var path = this.path;

	var newPos = new THREE.Vector3().copy(this.from)
		.lerp(this.to, this.lerpPercentage);

	lerpFactor += dTime * this.speed; //speed
	this.lerpPercentage = Math.min(1, lerpFactor); //[0, 1]

	//if you reached the end, go to next point
	if (lerpFactor >= 1) {
    //begin at 0%
		this.lerpPercentage = 0;
		this.index++;
		//reached the end? begin from start! (loop)
		if (this.index >= path.length - 1) {
			this.index = 0;
		}
		this.from = toVector3(path[this.index]);
		this.to = toVector3(path[this.index + 1]);

    //adjust speed
    this.calculateSpeed();
	}

  //and finally, set the new interpolated position
	this.mesh.position.copy(newPos);
};

exports.PathAnimation.prototype.calculateSpeed = function() {
  //get the distance/length from a to b
  var distance = new THREE.Vector3().copy(this.to).sub(this.from).length();
  this.speed = 6 / distance;
};

exports.PathAnimation.prototype.dispose = function() {
	this.mesh.geometry.dispose();
	this.mesh.material.dispose();

	this.mesh = null;
  this.path = null;
	this.lerpPercentage = null;
	this.index = null;
	this.from = null;
	this.to = null;
	this.speed = null;
};
*/

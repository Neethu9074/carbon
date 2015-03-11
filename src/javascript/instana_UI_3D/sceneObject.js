'use strict';

//var math = require('./math');
var THREE = require('three.js');

exports.SceneObject = function SceneObject() {
};

exports.SceneObject.prototype.init = function(app, id, x, y, z, w, h, d) {
		this.name = id;// 'Scene Object ' + math.guid();
		this.position = new THREE.Vector3(x, y, z);
		this.dimension = new THREE.Vector3(w, h, d);
		this.mesh = undefined;
		this.collisionMesh = undefined;
		this.needsUpdate = false;
		this.appRef = app;
};

exports.SceneObject.prototype.setStatic = function(mesh) {
  //position will not change, so set to static which gives a perfomance boost
  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();
};

exports.SceneObject.prototype.getName = function() {
	return this.name;
};

exports.SceneObject.prototype.setMesh = function(mesh) {
	this.mesh = mesh;
	//set names to identify later
	this.mesh.name = this.name;
};

exports.SceneObject.prototype.getMesh = function() {
	return this.mesh;
};

exports.SceneObject.prototype.setCollisionMesh = function(collMesh) {
	this.collisionMesh = collMesh;
};

exports.SceneObject.prototype.getCollisionMesh = function() {
	return this.collisionMesh;
};

exports.SceneObject.prototype.registerForUpdate = function() {
	this.needsUpdate = true;
};

exports.SceneObject.prototype.disposeSceneObject = function() {
	this.name = null;
	this.position = null;
	this.dimension = null;
	this.mesh = null;
	this.collisionMesh = null;
	this.needsUpdate = null;
	this.appRef = null;
};

'use strict';

//var math = require('./math');

exports.SceneObject = function SceneObject() {
};

exports.SceneObject.prototype.init = function(app, id) {
		this.name = id;// 'Scene Object ' + math.guid();;
		this.mesh = undefined;
		this.collisionMesh = undefined;
		this.needsUpdate = false;
		this.appRef = app;
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

'use strict';

var THREE = require('three.js');

exports.SceneObject = function SceneObject() {
};

exports.SceneObject.prototype.init = function(app, id, x, y, z, w, h, d) {
		this.name = id;
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
	this.mesh.name = this.name;
};

exports.SceneObject.prototype.getMesh = function() {
	return this.mesh;
};

exports.SceneObject.prototype.setCollisionMesh = function(collMesh) {
	this.collisionMesh = collMesh;
	this.collisionMesh.name = this.name;
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

exports.SceneObject.prototype.setDimensionSceneObject = function(width, depth) {
	this.dimension.set(width,	this.dimension.y, depth);

	this.mesh.scale.set(width, this.dimension.y, depth);
	this.collisionMesh.scale.set(
		width * 1.01,
		this.dimension.y * 1.01,
		depth * 1.01);

	this.mesh.updateMatrix();
	this.collisionMesh.updateMatrix();

	this.appRef.octree.remove(this.collisionMesh);
	this.appRef.octree.add(this.collisionMesh, {
		useFaces: false
	});
};

exports.SceneObject.prototype.setPositionSceneObject = function(pos) {
	this.position.copy(pos);

	this.mesh.position.copy(pos);
	this.mesh.position.x += this.dimension.x / 2;
	this.mesh.position.y += this.dimension.y / 2;
	this.mesh.position.z -= this.dimension.z / 2;

	this.collisionMesh.position.copy(pos);
	this.collisionMesh.position.x += this.dimension.x / 2;
	this.collisionMesh.position.y += this.dimension.y / 2;
	this.collisionMesh.position.z -= this.dimension.z / 2;

	this.mesh.updateMatrix();
	this.collisionMesh.updateMatrix();

	this.appRef.octree.remove(this.collisionMesh);
	this.appRef.octree.add(this.collisionMesh, {
		useFaces: false
	});
};

'use strict';

var math = require('./math');

exports.SceneObject = function SceneObject() {
	var guid = math.guid();
	this.name = 'Scene Object ' + guid;
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

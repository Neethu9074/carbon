'use strict';

var THREE = require('three.js');

var sceneObj = require('./sceneObject');
var materials = require('../mats');
var math = require('../math');


exports.Ground = function Ground(app) {
	var pos = new THREE.Vector3(500, -0.1, -500);
	var dim = new THREE.Vector3(1000, 0, 1000);

	//call super constructor
	sceneObj.SceneObject.call(this, app, 'ground' + math.guid(), pos, dim);


	var geo = new THREE.PlaneBufferGeometry(dim.x, dim.z, 1, 1);
	var plane = new THREE.Mesh(geo, materials.groundMaterial);

	plane.rotation.x = -90 * math.DegToRad;
	plane.position.copy(pos);
	this.setStatic(plane);

	this.ground = plane;
	this.app.scene.add(plane);
};

//inherence from SceneObject
exports.Ground.prototype = new sceneObj.SceneObject();
exports.Ground.prototype.constructor = exports.Ground;


exports.Ground.prototype.dispose = function() {
	//TODO: call super dispose ?

	this.app.scene.remove(this.ground);

	this.ground.geometry.dispose();
	this.ground.material.dispose();
	this.ground = null;
};

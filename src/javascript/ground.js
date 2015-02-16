'use strict';

var THREE = require('three.js');
var math = require('./math');
var sceneObj = require('./sceneObject');
var materials = require('./materials');

//var url = require('image!../images/floor.png');
//var config = require('./config');

exports.Ground = function Ground(app) {
	this.init();

	this.appReference = app;

	var x = 10000, y = 10000;
	var geometry = new THREE.PlaneBufferGeometry(x, y, 1, 1);

	var maxAnisotropy = app.mainRenderer.getMaxAnisotropy();
	var texture = THREE.ImageUtils.loadTexture('./images/floor.png');
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set((x / 25), (y / 25));
	texture.anisotropy = maxAnisotropy;

	var material = materials.groundMaterial;
	material.map = texture;

	var plane = new THREE.Mesh(geometry, material);
	plane.rotation.x = 90 * math.DegToRad;
	plane.doubleSided = true;
	plane.position.set(x / 2 - 2.5, -0.1, -y / 2 + 2.5);

	//position will not change, so set to static which gives a perfomance boost
	plane.matrixAutoUpdate = false;
	plane.updateMatrix();

	this.setMesh(plane);
};

//inherence from SceneObject
exports.Ground.prototype = new sceneObj.SceneObject();
exports.Ground.prototype.constructor = exports.Ground;

'use strict';

var THREE = require('three.js');
var colors = require('./colors');
var math = require('./math');
var sceneObj = require('./sceneObject');
var materials = require('./materials');
var url = require('image!../images/floor.png');
var config = require('./config');

exports.Ground = function Ground() {
	this.init();

	var x = 10000, y = 10000;
	var geometry = new THREE.PlaneBufferGeometry(x, y, 1, 1);
/*	var maxAnisotropy = 16;//app.renderer.getMaxAnisotropy();

	var texture = THREE.ImageUtils.loadTexture(config.bundlePath + url);
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(x, y);
	texture.anisotropy = maxAnisotropy;
*/

	var material = materials.groundMaterial;

	var plane = new THREE.Mesh(geometry, material);
	plane.rotation.x = 90 * math.DegToRad;
	plane.doubleSided = true;
	plane.position.set(x / 2, -0.1, -y / 2 );

	this.setMesh(plane);

	var gridHelper = new THREE.GridHelper( x, 10 );
	gridHelper.position.set(x / 2, -0.05, -y / 2);
	gridHelper.setColors(
		colors.midBlue,
		colors.darkBlue);
		this.setMesh(gridHelper);
};

//inherence from SceneObject
exports.Ground.prototype = new sceneObj.SceneObject();
exports.Ground.prototype.constructor = exports.Ground;

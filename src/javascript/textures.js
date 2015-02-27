'use strict';

var THREE = require('three.js');
var gridImagePath = require('../images/grid.png');
var cubeImagePath = require('../images/cube.png');
var softwareCubePath = require('../images/softwareCube.png');


exports.groundTexture = getGround();

function getGround() {
	var texture = THREE.ImageUtils.loadTexture('bundle/' + gridImagePath);
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(10, 10);
	return texture;
}

exports.serverCubeTexture = getCube();

function getCube() {
	var texture = THREE.ImageUtils.loadTexture('bundle/' + cubeImagePath);
	texture.anisotropy = 4;
	return texture;
}

exports.softwareCubeTexture = getSoftwareCube();

function getSoftwareCube() {
	var texture = THREE.ImageUtils.loadTexture('bundle/' + softwareCubePath);
	texture.anisotropy = 4;
	return texture;
}

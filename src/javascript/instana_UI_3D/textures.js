'use strict';

var THREE = require('three.js');
var gridImagePath = require('../../images/grid.png');
var cubeImagePath = require('../../images/cube.png');
var softwareCubePath = require('../../images/softwareCube.png');
var highlightPath = require('../../images/highlightCube.png');


//the repeated texture for the ground
exports.groundTexture = getGround();
function getGround() {
	var texture = THREE.ImageUtils.loadTexture('bundle/' + gridImagePath);
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(50, 50);
	return texture;
}

//the texture for all server cubes
exports.serverCubeTexture = getCube();
function getCube() {
	var texture = THREE.ImageUtils.loadTexture('bundle/' + cubeImagePath);
	texture.anisotropy = 4;
	return texture;
}

//the texture for all software cubes
exports.softwareCubeTexture = getSoftwareCube();
function getSoftwareCube() {
	var texture = THREE.ImageUtils.loadTexture('bundle/' + softwareCubePath);
	texture.anisotropy = 4;
	return texture;
}

//the texture for the hightlight box/cube
exports.highlightTexture = getHighlight();
function getHighlight() {
	var texture = THREE.ImageUtils.loadTexture('bundle/' + highlightPath);
	return texture;
}

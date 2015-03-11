'use strict';

var THREE = require('three.js');
var gridImagePath = require('../../images/grid.png');
var cubeImagePath = require('../../images/cube.png');
var softwareCubePath = require('../../images/softwareCube.png');
var highlightPath = require('../../images/highlightCube.png');

var cloudPath1 = require('../../images/cloud1.png');
var cloudPath2 = require('../../images/cloud2.png');
var cloudPath3 = require('../../images/cloud3.png');


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

//the repeated texture for the ground
exports.cloudTextures = getClouds();
function getClouds() {
	return [
		THREE.ImageUtils.loadTexture('bundle/' + cloudPath1),
		THREE.ImageUtils.loadTexture('bundle/' + cloudPath2),
		THREE.ImageUtils.loadTexture('bundle/' + cloudPath3)
	];
}

'use strict';

var THREE = require('three.js');


exports.groundTexture = getGround();

function getGround() {
	var texture = THREE.ImageUtils.loadTexture('./images/grid.png');
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(10, 10);
	return texture;
}


exports.serverCubeTexture = getCube();

function getCube() {
	var texture = THREE.ImageUtils.loadTexture('./images/cube.png');
	texture.anisotropy = 4;
	return texture;
}

exports.softwareCubeTexture = getSoftwareCube();

function getSoftwareCube() {
	var texture = THREE.ImageUtils.loadTexture('./images/softwareCube.png');
	texture.anisotropy = 4;
	return texture;
}

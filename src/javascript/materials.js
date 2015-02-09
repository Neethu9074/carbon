'use strict';

var THREE = require('three.js');
var colors = require('./colors');

exports.groundmaterial = new THREE.MeshBasicMaterial({
	color: colors.groundColor,
	side: THREE.DoubleSide
});

exports.cubematerials = [
	createCubeMaterial(colors.cubeGreenDarkColor), //right
	createCubeMaterial(colors.cubeGreenDarkColor), //left
	createCubeMaterial(colors.cubeGreenLightColor), //top
	createCubeMaterial(colors.cubeGreenLightColor), //bottom
	createCubeMaterial(colors.cubeGreenDarkColor), //front
	createCubeMaterial(colors.cubeGreenDarkColor) //back
];

exports.cubematerial = createCubeMaterial(colors.cubeGreenLightColor);

function createCubeMaterial(cubeColor) {
	return new THREE.MeshLambertMaterial({
		color: cubeColor,
		side: THREE.DoubleSide
	});
	/*return new THREE.MeshLambertMaterial({
		color: cubeColor,
		depthWrite: false,
		transparent: true,
		opacity: 0.8,
		side: THREE.DoubleSide,
		combine: THREE.MixOperation
	});*/
}

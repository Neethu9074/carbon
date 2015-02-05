'use strict';

var colors = require('./colors');

module.exports = function Cube(scene, x, y, width, depth, height) {
	var materials = [
		createMaterial(colors.cubeGreenMidColor), //right
		createMaterial(colors.cubeGreenMidColor), //left
		createMaterial(colors.cubeGreenDarkColor), //top
		createMaterial(colors.cubeGreenDarkColor), //bottom
		createMaterial(colors.cubeGreenLightColor), //front
		createMaterial(colors.cubeGreenLightColor) //back
	];
	var cube = new THREE.Mesh(
		new THREE.BoxGeometry(width, height, depth),
		new THREE.MeshFaceMaterial(materials));

	cube.position.set((width / 2) + x, height / 2, (-depth / 2) - y);

	scene.add(cube);
};

function createMaterial(color) {
	return new THREE.MeshBasicMaterial({
		color: color,
		depthWrite: false,
		transparent: true,
		opacity: 0.4,
		side: THREE.DoubleSide,
		combine: THREE.MixOperation
	});
}

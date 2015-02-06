'use strict';

var THREE = require('three.js');
var colors = require('./colors');
var sceneObj = require('./sceneObject');

exports.Cube = function Cube(x, y, width, depth, height) {
	var group = new THREE.Group();

	var xMiddle = (width / 2) + x;
	var zMiddle = (-depth / 2) - y;
	var yMiddle = height / 2;
	group.position.set(xMiddle, yMiddle, zMiddle);

  var name = this.getName();
	group.add(createCube(width, height, depth, name));
	group.add(createSphere(name));

	this.setMesh(group);
};

//inherence from SceneObject
exports.Cube.prototype = new sceneObj.SceneObject();
exports.Cube.prototype.constructor = exports.Cube;

function createCube(width, height, depth, name) {
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

	//set name to identify later
	cube.name = name;
	return cube;
}

function createSphere(name) {
	//add a sphere in the middle
	var sphereMaterial = new THREE.MeshBasicMaterial({
		color: colors.connectionColor
	});

	var sphere = new THREE.Mesh(new THREE.SphereGeometry(0.05), sphereMaterial);

	//set name to identify later
	sphere.name = name;
	return sphere;
}

function createMaterial(cubeColor) {
	return new THREE.MeshBasicMaterial({
		color: cubeColor,
		depthWrite: false,
		transparent: true,
		opacity: 0.4,
		side: THREE.DoubleSide,
		combine: THREE.MixOperation
	});
}

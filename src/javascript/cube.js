'use strict';

var THREE = require('three.js');
var colors = require('./colors');
var sceneObj = require('./sceneObject');
var materials = require('./materials.js');
var math = require('./math');

exports.Cube = function Cube(x, y, width, depth, height) {

	//no cube is smaller than (1, 0.25, 1)
	width = Math.max(width, 1);
	depth = Math.max(depth, 1);
	height = Math.max(height, 0.25);

	var xMiddle = (width / 2) + x;
	var zMiddle = (-depth / 2) - y;
	var yMiddle = height / 2;

	var group = new THREE.Object3D();
	var name = this.getName();
	var cube = createCube(width, height, depth, name);
	var boundingCube = createBoundingCube(cube);
	var label = createLabel(width, height, depth, name);

	cube.position.set(xMiddle, yMiddle, zMiddle);
	boundingCube.position.set(xMiddle, yMiddle, zMiddle);
	label.position.add(new THREE.Vector3(xMiddle, yMiddle, zMiddle));

	group.add(cube);
	group.add(boundingCube);
	group.add(label);

	this.setMesh(group);
};

//inherence from SceneObject
exports.Cube.prototype = new sceneObj.SceneObject();
exports.Cube.prototype.constructor = exports.Cube;

function createCube(width, height, depth, name) {

	var cube = new THREE.Mesh(
		new THREE.BoxGeometry(width, height, depth), materials.cubematerial);

	//set name to identify later
	cube.name = name;
	return cube;
}

function createBoundingCube(cube) {
	var egh = new THREE.EdgesHelper(cube, 0x00ffff);

	//set name to identify later
	egh.name = name;
	return egh;
}

function createLabel(width, height, depth, name) {
	var topOfCube = height / 2 + 0.001;
	var labelHeight = 0.1;
	var frontEdgePosition = (-depth / 2) + (labelHeight / 2) + 0.05;

	var labelMat = new THREE.MeshBasicMaterial({
		color: 0xF0F0F0
	});
	var geometry = new THREE.PlaneBufferGeometry(
		width - 0.1, //reduce width, because we manipulate the x position
		labelHeight, 1, 1);
	var plane = new THREE.Mesh(geometry, labelMat);
			plane.rotateOnAxis(new THREE.Vector3(1, 0, 0), -90 * math.DegToRad);
			plane.position.set(0.01, topOfCube, frontEdgePosition);

	//set name to identify later
	plane.name = name;
	return plane;
}

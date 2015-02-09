'use strict';

var THREE = require('three.js');
var sceneObj = require('./sceneObject');
var materials = require('./materials.js');
var math = require('./math');

exports.Cube = function Cube(x, y, width, depth, height) {
	this.init();

	//no cube is smaller than (1, 0.25, 1)
	width = Math.max(width, 1);
	depth = Math.max(depth, 1);
	height = Math.max(height, 0.25);

	var xMiddle = (width / 2) + x;
	var zMiddle = (-depth / 2) - y;
	var yMiddle = height / 2;

	var group = new THREE.Object3D();

	var cube = createCube(width, height, depth, this.name);
	var collisionCube = createCollisionCube(width, height, depth, this.name);
	var boundingCube = createBoundingCube(collisionCube, this.name);
	var label = createLabel(width, height, depth, this.name);

	cube.position.set(xMiddle, yMiddle, zMiddle);
	collisionCube.position.set(xMiddle, yMiddle, zMiddle);
	boundingCube.position.set(xMiddle, yMiddle, zMiddle);
	label.position.add(new THREE.Vector3(xMiddle, yMiddle, zMiddle));

	group.add(collisionCube);
	group.add(cube);
	group.add(boundingCube);
	group.add(label);

	this.setMesh(group);
	this.setCollisionMesh(collisionCube);
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

//this cube is used for collision / ray detection. In the app file,
//the collision objects are stored in a seperate collection to minimize
//collision cecking. the collision cube is a little bit bigger
//than the original cube.
function createCollisionCube(width, height, depth, name) {
	var offset = 0.01;
	var cube = new THREE.Mesh(
		new THREE.BoxGeometry(
			width + offset,
			height + offset,
			depth + offset),
		new THREE.MeshBasicMaterial({
			visible: false,
			color: 0xf0f0f0
		}));

	//set name to identify later
	cube.name = name;
	return cube;
}

function createBoundingCube(cube, name) {
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
		width - 0.1, //reduce width, because we want a small gap
		labelHeight, 1, 1);
	var plane = new THREE.Mesh(geometry, labelMat);
			plane.rotateOnAxis(new THREE.Vector3(1, 0, 0), -90 * math.DegToRad);
			plane.position.set(0, topOfCube, frontEdgePosition);

	//set name to identify later
	plane.name = name;
	return plane;
}

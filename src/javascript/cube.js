'use strict';

var THREE = require('three.js');
var sceneObj = require('./sceneObject');
var materials = require('./materials.js');
var math = require('./math');
var colors = require('./colors');
var textTexture = require('./extensions/textTextureFacade.js');

exports.Cube = function Cube(x, y, scaleFactor) {
	this.init();

	//no cube is smaller than (30, 5, 30)
	var width = 10 * scaleFactor;
	var depth = 10 * scaleFactor;
	var height = 3;

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = depth;

	var dimension = {
		x: (width / 2) + x,
		y: (height / 2),
		z: (-depth / 2) - y,
		width: width,
		height: height,
		depth: depth
	};

	var group = new THREE.Object3D();

	var lodCubes = createLODCubes(dimension, this.name);
	var collisionCube = createCollisionCube(dimension, this.name);
	var boundingCube = createBoundingCube(collisionCube, dimension, this.name);
	var lodLabels = createLODLabels(dimension, this.name);

	group.add(collisionCube);
	group.add(lodCubes);
	group.add(boundingCube);
	group.add(lodLabels);

	setStatic(collisionCube);
	setStatic(boundingCube);
	setStatic(collisionCube);

	this.setMesh(group);
	this.setCollisionMesh(collisionCube);
};

function setStatic(mesh){
	//position will not change, so set to static which gives a perfomance boost
	mesh.matrixAutoUpdate = false;
	mesh.updateMatrix();
}

//inherence from SceneObject
exports.Cube.prototype = new sceneObj.SceneObject();
exports.Cube.prototype.constructor = exports.Cube;

function createCube(width, height, depth, name, transparent) {
	//get material from global class
	var material = materials.cubeMaterialTransparent;
	if (transparent === false) {
		material = materials.cubeMaterialOpaque;
	}

	var cube = new THREE.Mesh(
		new THREE.BoxGeometry(width, height, depth),
		material);

	//set name to identify later
	cube.name = name;
	return cube;
}


//this cube is used for collision / ray detection. In the app file,
//the collision objects are stored in a seperate collection to minimize
//collision cecking. the collision cube is a little bit bigger
//than the original cube.
function createCollisionCube(dimension, name) {
	var offset = 0.01;
	var cube = new THREE.Mesh(
		new THREE.BoxGeometry(
			dimension.width + offset,
			dimension.height + offset,
			dimension.depth + offset),
		new THREE.MeshBasicMaterial({
			visible: false,
			color: colors.lightBlue,
			transparent: true,
			opacity: 0.8
		}));

	cube.position.set(dimension.x, dimension.y, dimension.z);
	setStatic(cube);

	//set name to identify later
	cube.name = name;
	return cube;
}

function createBoundingCube(cube, dimension, name) {
	var egh = new THREE.EdgesHelper(cube, colors.lightBlue);

	egh.position.set(dimension.x, dimension.y, dimension.z);
	setStatic(egh);

	//set name to identify later
	egh.name = name;
	return egh;
}

function createLabel(width, height, depth, name) {
	width -= 1; //transform to the right
	var labelHeight = 1;
	var aspect = width / labelHeight;
	var topOfCube = height / 2 + 0.01;
	var frontEdgePosition = (-depth / 2) + (labelHeight / 2) + 1;

	//get a texture from the facade
	var tex = textTexture.createTexture(name, aspect);
	//set to linear because the texture is not power of 2 (64x64, 32x32, ...)
	tex.minFilter = THREE.LinearFilter;
	var labelMat = new THREE.MeshBasicMaterial({
		map: tex,
		transparent: true
	});
	var geometry = new THREE.PlaneBufferGeometry(width, labelHeight, 1, 1);
	var plane = new THREE.Mesh(geometry, labelMat);
	plane.rotateOnAxis(new THREE.Vector3(1, 0, 0), -90 * math.DegToRad);
	plane.position.set(0, topOfCube, frontEdgePosition);
	setStatic(plane);

	//set name to identify later
	plane.name = name;
	return plane;
}

function createLODLabels(dimension, name) {
	var label = createLabel(
		dimension.width,
		dimension.height,
		dimension.depth, name);

	//LOD for label
	var lod = new THREE.LOD();
	lod.addLevel(label, 20);
	lod.addLevel(new THREE.Object3D(), 100);

	lod.position.add(new THREE.Vector3(dimension.x, dimension.y, dimension.z));

	return lod;
}

function createLODCubes(dimension, name) {
  var w = dimension.width;
  var h = dimension.height;
  var d = dimension.depth;

	var detailedCube = createCube(w, h, d, name, true);
	var cube = createCube(w, h, d, name, false);

	setStatic(cube);
	setStatic(detailedCube);

	var lod = new THREE.LOD();
	lod.addLevel(detailedCube, 20);
	lod.addLevel(cube, 80);

	lod.position.set(dimension.x, dimension.y, dimension.z);

	return lod;
}

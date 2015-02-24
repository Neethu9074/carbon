'use strict';

var THREE = require('three.js');
var sceneObj = require('./sceneObject');
var colors = require('./colors');
var textures = require('./textures');
require('./extensions/OBJLoader');

exports.BaseCube = function BaseCube(
	app, x, y, z, width, height, depth, detailed) {
	if (app === undefined || x === undefined ||
		y === undefined || z === undefined || width === undefined ||
		height === undefined || depth === undefined) {
		return undefined;
	}

	this.init();

	this.x = x;
	this.y = z;

	this.dimension = {
		x: (width / 2.0) + x,
		y: (height / 2.0) + y,
		z: (-depth / 2.0) - z,
		width: width,
		height: height,
		depth: depth
	};

	//create cubes
	var group = new THREE.Object3D();
	//create main cube mesh
	this.createCube(app, this.dimension, this.name, group, detailed);

	//create helper objects
	var collisionCube = createCollisionCube(this.dimension, this.name);
	this.setStatic(collisionCube);

	this.setMesh(group);
	this.setCollisionMesh(collisionCube);
};

//inherence from SceneObject
exports.BaseCube.prototype = new sceneObj.SceneObject();
exports.BaseCube.prototype.constructor = exports.BaseCube;

exports.BaseCube.prototype.setStatic = function(mesh) {
	//position will not change, so set to static which gives a perfomance boost
	mesh.matrixAutoUpdate = false;
	mesh.updateMatrix();
};

exports.BaseCube.prototype.collectMaterials = function() {
	var obj = this.getMesh();
	var find = function(mats, object) {
		for (var i = 0; i < object.children.length; i++) {
			var item = object.children[i];
			if (item.material !== undefined) {
				mats.push(item.material);
			}
			find(mats, item);
		}
	};

	var materials = [];
	find(materials, obj);
	return materials;
};

exports.BaseCube.prototype.createCube = function(app, dimension, name, group,
	detailed) {
	var width = dimension.width,
		height = dimension.height,
		depth = dimension.depth;
  var pos = new THREE.Vector3(dimension.x, dimension.y,	dimension.z);

	if (detailed) {
		//need a new material, each for each cube...
		var material = new THREE.MeshLambertMaterial({
			color: colors.midBlue,
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 1,
			blending: THREE.NormalBlending,
			map: textures.serverCubeTexture
		});
		var setStatic = this.setStatic;
		var loader = new THREE.OBJLoader();

		// load a resource
		loader.load(
			// resource URL
			'obj/cube.obj',
			// Function when resource is loaded
			function(object) {
				object = object.children[0];
				object.position.copy(pos);
        object.translateY(-dimension.height / 2);
				object.scale.set(width, height, depth);
				object.material = material;
				object.name = name;

				setStatic(object);
				group.add(object);

				fadeIn(app, object.material);
			}
		);
	} else {
		//need a new material, each for each cube...
		var simpleMaterial = new THREE.MeshLambertMaterial({
			color: colors.lightBlue,
			map: textures.softwareCubeTexture
		});
		var cube = new THREE.Mesh(
			new THREE.BoxGeometry(width, height, depth),
			simpleMaterial);

		cube.position.copy(pos);
		this.setStatic(cube);
		group.add(cube);
	}
};

function fadeIn(app, material) {
	//setup fade in animation
	var from = {
		v: 0
	};
	var to = {
		v: 1
	};

	//1sec animation duration
	var tween = new app.tweenEngine.Tween(from).to(to, 1000);
	tween.onUpdate(function() {
		material.opacity = from.v;
	});

	tween.start();
	tween.easing(app.tweenEngine.Easing.Cubic.InOut);
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
			color: colors.lightBlue,
			transparent: true,
			opacity: 0.5,
			blending: THREE.AdditiveBlending
		}));

	cube.position.set(dimension.x, dimension.y, dimension.z);

	//set name to identify later
	cube.name = name;
	return cube;
}

// tests, if a point is seen by the camera
exports.BaseCube.prototype.isVisible = function(point, camera) {
	var maxValue = -0.7;
	//get the view vector of the camera
	var V = new THREE.Vector3(0, 0, -1);
	V.applyQuaternion(camera.quaternion);
	V.normalize();

	//get the pointing vector from object to camera
	var O = new THREE.Vector3()
		.copy(camera.position)
		.sub(point)
		.normalize();

	var alpha = O.dot(V);
	if (alpha < maxValue) {
		return true;
	}
	return false;
};

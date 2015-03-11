'use strict';

var THREE = require('three.js');
var sceneObj = require('./sceneObject');
var pa = require('./pathAnimation.js');

//path is an array of 2DArrays -> [[0,0], [1,2], ...]
exports.Connection = function Connection(from, to, path) {
	this.init(from.appRef);

  var group = new THREE.Object3D();
  this.points = [];
	var line = this.createMesh(path);

	//position will not change, so set to static which gives a performance boost
	line.matrixAutoUpdate = false;
	line.updateMatrix();

  //setup path animation
  this.animator = new pa.PathAnimation(path);

  group.add(line);
  group.add(this.animator.mesh);
  this.setMesh(group);

  this.registerForUpdate();

	from.connectWith(to, this);
	to.connectWith(from, this);
};

//inherence from SceneObject
exports.Connection.prototype = new sceneObj.SceneObject();
exports.Connection.prototype.constructor = exports.Connection;

exports.Connection.prototype.createMesh = function(path) {
	for (var i = 0; i < path.length; i++) {
		var pos = new THREE.Vector3( path[i][0], 0.1, -path[i][1] );
		this.points.push(pos);
	}

	var geometry = new THREE.BufferGeometry();
	var material = new THREE.LineBasicMaterial({
		vertexColors: THREE.VertexColors
	});

	var positions = new Float32Array(this.points.length * 3);
	var colors = new Float32Array(this.points.length * 3);
	for (i = 0; i < this.points.length; i++) {
		var x = this.points[i].x;
		var y = this.points[i].y;
		var z = this.points[i].z;

		// positions
		positions[i * 3] = x;
		positions[i * 3 + 1] = y;
		positions[i * 3 + 2] = z;

		// colors
		colors[i * 3] = (x / 10) + 0.5;
		colors[i * 3 + 1] = (y / 10) + 0.5;
		colors[i * 3 + 2] = (z / 10) + 0.5;
	}

	geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

	return new THREE.Line(geometry, material);
};

exports.Connection.prototype.update = function() {
  this.animator.update(this.appRef.deltaTime);
};

exports.Connection.prototype.dispose = function() {
	for (var i = 0; i < this.getMesh().children.length; i++) {
		var child = this.getMesh().children[i];
		child.geometry.dispose();
		child.material.dispose();
	}

  this.disposeSceneObject();
	this.animator.dispose();

	this.points = null;
	this.animator = null;
};

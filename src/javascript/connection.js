'use strict';

var THREE = require('three.js');
var sceneObj = require('./sceneObject');

//path is an array of 2DArrays -> [[0,0], [1,2], ...]
exports.Connection = function Connection(path) {
  this.init();

  var line = createMesh(path);
  this.setMesh(line);
};

//inherence from SceneObject
exports.Connection.prototype = new sceneObj.SceneObject();
exports.Connection.prototype.constructor = exports.Connection;

function createMesh(path) {
  var points = [];
  for (var i in path) {
    //TODO: remove random height...
    var pos = new THREE.Vector3(path[i][0], 0.4+Math.random()/10, -path[i][1]);
    points.push(pos);
  }

  var geometry = new THREE.BufferGeometry();
  var material = new THREE.LineBasicMaterial({
    vertexColors: THREE.VertexColors
  });

  var positions = new Float32Array(points.length * 3);
  var colors = new Float32Array(points.length * 3);
  for (i = 0; i < points.length; i++) {
    var x = points[i].x;
    var y = points[i].y;
    var z = points[i].z;

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
}

/*
exports.Connection.prototype.test = function(fromPos, toPos) {
	var direction = new THREE.Vector3();
	direction.add(fromPos);
	direction.sub(toPos);
	direction.normalize();

	var right = direction.cross(new THREE.Vector3(0, 0, 1));
	right.multiplyScalar(0.1 / 2);

	var rightposA = new THREE.Vector3(
		fromPos.x + right.x, fromPos.y + right.y, fromPos.z + right.z);
	var leftposA = new THREE.Vector3(
		fromPos.x - right.x, fromPos.y - right.y, fromPos.z - right.z);
	var rightposB = new THREE.Vector3(
		toPos.x + right.x, toPos.y + right.y, toPos.z + right.z);
	var leftposB = new THREE.Vector3(
		toPos.x - right.x, toPos.y - right.y, toPos.z - right.z);

	var geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
	geometry.attributes.position.array[0] = leftposA.x;
	geometry.attributes.position.array[1] = leftposA.y;
	geometry.attributes.position.array[3] = rightposA.x;
	geometry.attributes.position.array[4] = rightposA.y;
	geometry.attributes.position.array[6] = leftposB.x;
	geometry.attributes.position.array[7] = leftposB.y;
	geometry.attributes.position.array[9] = rightposB.x;
	geometry.attributes.position.array[10] = rightposB.y;
	geometry.attributes.position.array[2] = leftposA.z;
	geometry.attributes.position.array[5] = rightposA.z;
	geometry.attributes.position.array[8] = leftposB.z;
	geometry.attributes.position.array[11] = rightposB.z;

	var mat = new THREE.MeshBasicMaterial({
		color: Math.random() * 0xffffff,
		side: THREE.DoubleSide
	});
	var plane = new THREE.Mesh(geometry, mat);
	plane.doubleSided = true;
	return plane;
};
*/

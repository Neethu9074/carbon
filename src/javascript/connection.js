'use strict';

var THREE = require('three.js');
var sceneObj = require('./sceneObject');
var material = require('./materials');

exports.Connection = function Connection(cubeFrom, cubeTo) {
  this.init();

  //calculate new positions
  var fromPos = cubeFrom.collisionMesh.position;
  var toPos = cubeTo.collisionMesh.position;

  this.setMesh(createMesh(fromPos, toPos));
  this.test(fromPos, toPos);
};

//inherence from SceneObject
exports.Connection.prototype = new sceneObj.SceneObject();
exports.Connection.prototype.constructor = exports.Connection;

function createMesh(fromPos, toPos) {
  var mat = material.lineMaterial;
  var actualpoints = [fromPos, toPos];
  var actualextrudePath = new THREE.SplineCurve3(actualpoints);
  var actualtube = new THREE.TubeGeometry(
    actualextrudePath, //path
    1, //segments
    0.02, //radius
    4, //radius segments
    false, false);

  return new THREE.Mesh(actualtube, mat);
}

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

	var texture = THREE.ImageUtils.loadTexture(
    'http://www.html5canvastutorials.com/demos/assets/crate.jpg' );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 1, 0.1 / 2 );

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
    side: THREE.DoubleSide,
    //map: texture,
    //transparent: true
    });
  var plane = new THREE.Mesh(geometry, mat);
  plane.doubleSided = true;
  this.setMesh(plane);
}

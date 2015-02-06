'use strict';

var THREE = require('three.js');
var colors = require('./colors');
var sceneObj = require('./sceneObject');
var math = require('./math');

exports.Cube = function Cube(x, y, width, depth, height) {
  //no cube is smaller than (1, 0.25, 1)
  width = Math.max(width, 1);
  depth = Math.max(depth, 1);
  height = Math.max(height, 0.25);

  var xMiddle = (width / 2) + x;
  var zMiddle = (-depth / 2) - y;
  var yMiddle = height / 2;

  var group = new THREE.Group();
  group.position.set(xMiddle, yMiddle, zMiddle);

  var name = this.getName();
  group.add(createCube(width, height, depth, name));
  group.add(createLabel(width, height, depth, name));
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

function createLabel(width, height, depth, name) {
  var topOfCube = height / 2 + 0.001;
  var labelHeight = 0.2;
  var frontEdgePosition = depth / 2 - labelHeight / 2;

  var labelMat = new THREE.MeshBasicMaterial({
    color: 0xf000A0
  });
  var geometry = new THREE.PlaneBufferGeometry(width, labelHeight, 1, 1);
  var plane = new THREE.Mesh(geometry, labelMat);
  plane.rotateOnAxis(new THREE.Vector3(1, 0, 0), -90 * math.DegToRad);
  plane.position.set(0, topOfCube, frontEdgePosition);

  //set name to identify later
  plane.name = name;
  return plane;
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

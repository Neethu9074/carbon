'use strict';

var THREE = require('three.js');
var sceneObj = require('./sceneObject');
var materials = require('./materials.js');
var math = require('./math');
var colors = require('./colors');
var textTexture = require('./extensions/textTextureFacade.js');

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

  var lod = createLODForLabel(label);
  lod.position.add(new THREE.Vector3(xMiddle, yMiddle, zMiddle));

  group.add(collisionCube);
  group.add(cube);
  group.add(boundingCube);
	group.add(lod);

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
      color: colors.lightBlue,
      transparent: true,
      opacity: 0.8
    }));

  //set name to identify later
  cube.name = name;
  return cube;
}

function createBoundingCube(cube, name) {
  var egh = new THREE.EdgesHelper(cube, colors.lightBlue);

  //set name to identify later
  egh.name = name;
  return egh;
}

function createLabel(width, height, depth, name) {
  width -= 0.08; //transform to the right
  var labelHeight = 0.05;
  var aspect = width / labelHeight;
  var topOfCube = height / 2 + 0.001;
  var frontEdgePosition = (-depth / 2) + (labelHeight / 2) + 0.1;

  var tex = textTexture.createTexture(name, aspect);
  var labelMat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true
  });
  var geometry = new THREE.PlaneBufferGeometry(width, labelHeight, 1, 1);
  var plane = new THREE.Mesh(geometry, labelMat);
  plane.rotateOnAxis(new THREE.Vector3(1, 0, 0), -90 * math.DegToRad);
  plane.position.set(0, topOfCube, frontEdgePosition);

  //set name to identify later
  plane.name = name;
  return plane;
}

function createLODForLabel(label) {
  //LOD for label
  var lod = new THREE.LOD();
  lod.addLevel(label, 4);

  //LOD needs more than 1 element to work...
  lod.addLevel(new THREE.Object3D(), 6);
	return lod;
}

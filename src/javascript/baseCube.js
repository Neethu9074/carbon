'use strict';

var THREE = require('three.js');
var sceneObj = require('./sceneObject');
var math = require('./math');
var colors = require('./colors');
var textTexture = require('./extensions/textTextureFacade.js');

exports.BaseCube = function BaseCube(app, x, y, scaleFactor) {
  this.init();

  //no cube is smaller than (30, 5, 30)
  var width = 10 * scaleFactor;
  var depth = 10 * scaleFactor;
  var height = 3;

  this.x = x;
  this.y = y;
  this.width = width;
  this.height = depth; //3D -> 2D for pathfinding (z becomes y)

  this.dimension = {
    x: (width / 2) + x,
    y: (height / 2),
    z: (-depth / 2) - y,
    width: width,
    height: height,
    depth: depth
  };

  //create cubes
  var group = new THREE.Object3D();
  //create main cube mesh
  this.detailedCube = this.createCube(this.dimension, this.name);
  this.setStatic(this.detailedCube);

  //create helper objects
  var collisionCube = createCollisionCube(this.dimension, this.name);
  this.setStatic(collisionCube);

  //create the label
  var lodLabels = createLODLabels(this.dimension,
    this.name,
    this.opacityAnimatedMaterials);

  group.add(this.detailedCube);
  //group.add(lodLabels);

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

exports.BaseCube.prototype.createCube = function(dimension, name) {
  var width = dimension.width,
    height = dimension.height,
    depth = dimension.depth;

  //need a new material, each for each cube...
  var material = new THREE.MeshLambertMaterial({
    color: colors.midBlue,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0,
    blending: THREE.NormalBlending
  });

  var cube = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    material);

  //set position and then static
  cube.position.set(dimension.x, dimension.y, dimension.z);

  //set name to identify later
  cube.name = name;
  return cube;
};

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
      opacity: 0.4
    }));

  cube.position.set(dimension.x, dimension.y, dimension.z);

  //set name to identify later
  cube.name = name;
  return cube;
}

function createLabel(dimension, name) {
  var width = dimension.width,
    height = dimension.height,
    depth = dimension.depth;

  width -= 0.5; //transform to the right
  var labelHeight = 1;
  var aspect = width;
  var topOfCube = height - 1.4;
  var frontEdgePosition = (depth / 2) - (labelHeight / 2) - 0.5;

  //get a texture from the facade
  var tex = textTexture.createTexture(name, aspect);
  //set to linear because the texture is not power of 2 (64x64, 32x32, ...)
  tex.minFilter = THREE.LinearFilter;

  var labelMat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false
  });

  var geometry = new THREE.PlaneBufferGeometry(width, labelHeight, 1, 1);
  var plane = new THREE.Mesh(geometry, labelMat);
  plane.position.y = topOfCube;
  plane.position.z = frontEdgePosition;
  plane.rotateOnAxis(new THREE.Vector3(1, 0, 0), -90 * math.DegToRad);

  plane.matrixAutoUpdate = false;
  plane.updateMatrix();

  //set name to identify later
  plane.name = name;
  return plane;
}

function createLODLabels(dimension, name, matCollection) {
  var label = createLabel(dimension, name);

  //LOD for label
  var lod = new THREE.LOD();
  lod.addLevel(label, 20);
  lod.addLevel(new THREE.Object3D(), 100);

  lod.position.add(new THREE.Vector3(dimension.x, dimension.y, dimension.z));

  return lod;
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

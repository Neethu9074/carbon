'use strict';

var THREE = require('three.js');
var sceneObj = require('./sceneObject');
var colors = require('./colors');
require('./extensions/OBJLoader');

exports.BaseCube = function BaseCube(
  app, x, y, z, width, height, depth) {
  if (app === undefined || x === undefined ||
    y === undefined || z === undefined || width === undefined ||
    height === undefined || depth === undefined) {
    return undefined;
  }

  this.init(app);

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

  //create helper objects
  var collisionCube = createCollisionCube(this.dimension, this.name);
  this.setStatic(collisionCube);
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
  var root = this.getMesh();
  var find = function(mats, object) {
    for (var i = 0; i < object.children.length; i++) {
      var item = object.children[i];
      if (item.material !== undefined) {
        mats.push(item.material);
      }
      find(mats, item);
    }
  };

  var materials = [ root.material ];
  find(materials, root);
  return materials;
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
      color: colors.lightBlue
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

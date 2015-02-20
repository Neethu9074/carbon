'use strict';

var THREE = require('three.js');
var sceneObj = require('./sceneObject');
var math = require('./math');
var colors = require('./colors');
var textures = require('./textures');
var textTexture = require('./extensions/textTextureFacade');
require('./extensions/OBJLoader');

exports.BaseCube = function BaseCube(app, x, y, width, height, depth) {
  this.init();

  this.x = x;
  this.y = y;
  this.width = width;
  this.height = depth; //3D -> 2D for pathfinding (z becomes y)

  this.dimension = {
    x: (width / 2.0) + x,
    y: (height / 2.0),
    z: (-depth / 2.0) - y,
    width: width,
    height: height,
    depth: depth
  };

  //create cubes
  var group = new THREE.Object3D();
  //create main cube mesh
  this.createCube(app, this.dimension, this.name, group);

  //create helper objects
  var collisionCube = createCollisionCube(this.dimension, this.name);
  this.setStatic(collisionCube);

  //create the label
  var lodLabels = createLODLabels(this.dimension,
    this.name,
    this.opacityAnimatedMaterials);

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

exports.BaseCube.prototype.createCube = function(app, dimension, name, group) {
  var width = dimension.width,
    height = dimension.height,
    depth = dimension.depth;

  //need a new material, each for each cube...
  var material = new THREE.MeshLambertMaterial({
    color: colors.midBlue,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1,
    blending: THREE.NormalBlending,
    map: textures.cubeTexture
  });

  var cube = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    material);

  var setStatic = this.setStatic;
  var loader = new THREE.OBJLoader();
  // load a resource
  loader.load(
    // resource URL
    'obj/cube.obj',
    // Function when resource is loaded
    function(object) {
      object = object.children[0];
      //set position and then static
      object.position.set(dimension.x, 0, dimension.z);
      object.scale.set(width, height, depth);

      object.material = material;

      //set name to identify later
      object.name = name;

      setStatic(object);
      group.add(object);

      fadeIn(app, object.material);
    }
  );
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
      color: colors.lightBlue
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

exports.BaseCube.prototype.createBoundingCube = function(
  cube, dimension, name) {
  var egh = new THREE.EdgesHelper(cube, colors.lightBlue);

  egh.position.set(dimension.x, dimension.y, dimension.z);
  this.setStatic(egh);

  //set name to identify later
  egh.name = name;
  return egh;
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

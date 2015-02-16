'use strict';

var THREE = require('three.js');
var sceneObj = require('./sceneObject');
var math = require('./math');
var colors = require('./colors');
var textTexture = require('./extensions/textTextureFacade.js');

exports.Cube = function Cube(x, y, scaleFactor) {
  this.init();
  this.registerForUpdate();

  //no cube is smaller than (30, 5, 30)
  var width = 10 * scaleFactor;
  var depth = 10 * scaleFactor;
  var height = 3;

  this.x = x;
  this.y = y;
  this.width = width;
  this.height = depth; //3D -> 2D for pathfinding (z becomes y)

  //tween parameters
  this.minDistanceForTransparency = 35;
  this.tweenDirection = 'out';

  var dimension = {
    x: (width / 2) + x,
    y: (height / 2),
    z: (-depth / 2) - y,
    width: width,
    height: height,
    depth: depth
  };

  //create cubes
  var group = new THREE.Object3D();
  this.detailedCube = createCube(dimension, name, true);

  //create helper objects
  var collisionCube = createCollisionCube(dimension, this.name);
  var boundingCube = createBoundingCube(collisionCube, dimension, this.name);

  //create the label
  var lodLabels = createLODLabels(dimension, this.name);

  group.add(collisionCube);
  group.add(this.detailedCube);
  group.add(boundingCube);
  group.add(lodLabels);

  setStatic(collisionCube);
  setStatic(boundingCube);
  setStatic(collisionCube);

  this.setMesh(group);
  this.setCollisionMesh(collisionCube);
};

function setStatic(mesh) {
  //position will not change, so set to static which gives a perfomance boost
  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();
}

//inherence from SceneObject
exports.Cube.prototype = new sceneObj.SceneObject();
exports.Cube.prototype.constructor = exports.Cube;

function createCube(dimension, name) {
  var width = dimension.width,
      height = dimension.height,
      depth = dimension.depth;

	//need a new material, each for each cube...
  var material = new THREE.MeshLambertMaterial({
		color: colors.midBlue,
		side: THREE.DoubleSide,
		transparent: true,
    opacity: 1,
		blending: THREE.NormalBlending
	});

  var cube = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    material);

    //set position and then static
  cube.position.set(dimension.x, dimension.y, dimension.z);
  setStatic(cube);

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
  setStatic(plane);

  //set name to identify later
  plane.name = name;
  return plane;
}

function createLODLabels(dimension, name) {
  var label = createLabel(dimension, name);

  //LOD for label
  var lod = new THREE.LOD();
  lod.addLevel(label, 20);
  lod.addLevel(new THREE.Object3D(), 100);

  lod.position.add(new THREE.Vector3(dimension.x, dimension.y, dimension.z));

  return lod;
}

exports.Cube.prototype.update = function(app) {
  var distance = new THREE.Vector3()
    .copy(app.mainCamera.position)
    .sub(this.collisionMesh.position)
    .length();

  if (distance < this.minDistanceForTransparency) {
    var tweenDirection = 'in';
  } else {
    tweenDirection = 'out';
  }

	//on direction changed
  if (this.tweenDirection !== tweenDirection) {
    this.tweenDirection = tweenDirection;
    //save the material!
    var mat = this.detailedCube.material;

    //setup tween
    var from = {
      v: tweenDirection === 'in' ? 1 : 0.25
    };
    var to = {
      v: tweenDirection === 'in' ? 0.25 : 1
    };
    //1 sec animation duration
    var tween = new app.tweenEngine.Tween(from).to(to, 1000);
    tween.onUpdate(function() {
      mat.opacity = from.v;
    });
    tween.start();
    tween.easing(app.tweenEngine.Easing.Cubic.InOut);
  }
};

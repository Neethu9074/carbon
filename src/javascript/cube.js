'use strict';

var THREE = require('three.js');
var sceneObj = require('./sceneObject');
var math = require('./math');
var colors = require('./colors');
var textTexture = require('./extensions/textTextureFacade.js');

var DIRECTION = {
  IN: {
    id: 1
  },
  OUT: {
    id: 2
  }
};

var DETAIL = {
  DETAILED: {
    id: 1
  },
  NOT_DETAILED: {
    id: 2
  }
};

exports.Cube = function Cube(app, x, y, scaleFactor) {
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
  this.tweenDirection = DIRECTION.OUT;

  var dimension = {
    x: (width / 2) + x,
    y: (height / 2),
    z: (-depth / 2) - y,
    width: width,
    height: height,
    depth: depth
  };

	//stores all materials, that are animated due to animation process
  this.opacityAnimatedMaterials = [];

  //create cubes
  var group = new THREE.Object3D();
  var detailedCube = createCube(dimension, name, true);

  //create helper objects
  var collisionCube = createCollisionCube(dimension, this.name);
  var boundingCube = createBoundingCube(collisionCube, dimension, this.name);

  //create the label
  var lodLabels = createLODLabels(dimension,
		this.name,
		this.opacityAnimatedMaterials);

  group.add(detailedCube);
  group.add(boundingCube);
  group.add(lodLabels);

	this.opacityAnimatedMaterials.push(detailedCube.material);

  setStatic(collisionCube);
  setStatic(boundingCube);
  setStatic(collisionCube);

  this.setMesh(group);
  this.setCollisionMesh(collisionCube);

  this.setTransparency(app, { v: 0 }, { v: 1 }, 250);
  this.details = getDetailsGroup(dimension);
	this.detailState = DETAIL.NOT_DETAILED;
};

function setStatic(mesh) {
  //position will not change, so set to static which gives a perfomance boost
  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();
}

function getDetailsGroup(dimension) {
  var obj = new THREE.Object3D();

  //need a new material, each for each cube...
  var material = new THREE.MeshLambertMaterial({
    color: 0xF000F0
  });
  var cube = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 3), material);
  obj.add(cube);
  obj.position.set(dimension.x, 1, dimension.z);
  obj.name = 'detail cube';
  return obj;
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
    opacity: 0,
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
      color: colors.lightBlue,
      transparent: true,
      opacity: 0.4
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

function createLODLabels(dimension, name, matCollection) {
  var label = createLabel(dimension, name);

  //LOD for label
  var lod = new THREE.LOD();
  lod.addLevel(label, 20);
  lod.addLevel(new THREE.Object3D(), 100);

  lod.position.add(new THREE.Vector3(dimension.x, dimension.y, dimension.z));

	matCollection.push(label.material);

  return lod;
}

exports.Cube.prototype.update = function(app) {
  var objectPos = this.collisionMesh.position;
  var cam = app.mainCamera;

  var distance = new THREE.Vector3()
    .copy(cam.position)
    .sub(objectPos)
    .length();

  if (distance < this.minDistanceForTransparency) {
    var tweenDirection = DIRECTION.IN;
  } else {
    tweenDirection = DIRECTION.OUT;
  }

  //if direction changed and object is visible
  if (this.tweenDirection !== tweenDirection && isVisible(objectPos, cam)) {
    this.tweenDirection = tweenDirection;

    if (tweenDirection === DIRECTION.IN) {
			//fade in and then show details
      this.setTransparency(app, {
        v: 1
      }, {
        v: 0.15
      }, 500, this.showDetails);
    } else {
			//fade out and then hide details
      this.setTransparency(app, {
        v: 0.15
      }, {
        v: 1
      }, 500, this.hideDetails);
    }
  }
};

// tests, if a point is seen by the camera
function isVisible(point, camera) {
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
  if(alpha < maxValue){
    return true;
  }
  return false;
}

exports.Cube.prototype.hideDetails = function(app, cube) {
  //app.removeObject(cube.details);
  app.scene.remove(cube.details);
	cube.detailState = DETAIL.NOT_DETAILED;

  //add collision object to octree to enable raypicking for this cube
	app.octree.add(cube.getCollisionMesh());
	app.octree.update();
};

exports.Cube.prototype.showDetails = function(app, cube) {
  app.scene.add(cube.details);
	cube.detailState = DETAIL.DETAILED;

  //remove collision object from octree to get access to the details
	app.octree.remove(cube.getCollisionMesh());
	app.octree.update();
};

exports.Cube.prototype.setTransparency = function(app, from, to, delay, f) {
  //save the material!
  var mats = this.opacityAnimatedMaterials;
  var dly = delay === undefined ? 500 : delay; //default 500ms delay
  var func = f;
	var cube = this;

  //1sec animation duration
  var tween = new app.tweenEngine.Tween(from).to(to, 1000);
  tween.onUpdate(function() {
    for (var i = 0; i < mats.length; i++) {
      mats[i].opacity = from.v;
    }
  });

  tween.delay(dly);
  tween.start();
  tween.easing(app.tweenEngine.Easing.Cubic.InOut);
  tween.onComplete(function() {
    if (func !== undefined) {
      func(app, cube);
    }
  });
};

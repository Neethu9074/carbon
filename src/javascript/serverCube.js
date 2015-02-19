'use strict';

var THREE = require('three.js');
var math = require('./math');
var baseCube = require('./baseCube');

var DIRECTION = {
  IN: { id: 1 },
  OUT: { id: 2 }
};

var htmlContent = [
  ['<img src="images/Ok.png">'].join('\n'),
  ['<img src="images/Warning.png">'].join('\n'),
  ['<img src="images/Error.png">'].join('\n')
];

exports.ServerCube = function ServerCube(app, x, y, scaleFactor) {
  if (app === undefined || x === undefined ||
    y === undefined || scaleFactor === undefined) {
    return undefined;
  }

  var width = 10 * scaleFactor;
  var height = 3;
  var depth = 10 * scaleFactor;
  baseCube.BaseCube.call(this, app, x, y, width, height, depth);

	//a collection which stores all cubes inside this server cube
	this.children = [];

  //register for update to calculate distance and fading
  this.registerForUpdate();

  //tween parameters
  this.minDistanceForTransparency = 16.5;
  this.tweenDirection = DIRECTION.OUT;

  //stores all materials, that are animated due to animation process
  this.opacityAnimatedMaterials = this.collectMaterials();

  this.details = getDetailsGroup(this.dimension);
  this.setStatic(this.details);

  //save the css stuff
  this.cssObject = createCSS3DTestStuff(app, this.dimension);
  this.setTransparency(app, {
    v: 0
  }, {
    v: 1
  }, 0);
  this.hideDetails(app, this);
};

//inherence from SceneObject
exports.ServerCube.prototype = new baseCube.BaseCube();
exports.ServerCube.prototype.constructor = exports.ServerCube;

exports.ServerCube.prototype.addSoftware = function(softwareCube){
  this.children.push(softwareCube);
  console.log('software added to server');
};

function getDetailsGroup(dimension) {
  //need a new material, each for each cube...
  var material = new THREE.MeshLambertMaterial({
    color: 0xF000F0
  });
  var cube = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 3), material);

  cube.position.set(dimension.x, 1, dimension.z);
  cube.name = 'detail cube';
  return cube;
}

function createCSS3DTestStuff(app, dimension) {
  var pos = new THREE.Vector3(dimension.x, dimension.y * 2, dimension.z);
  var scaleX = dimension.width / 10;
  var scaleY = dimension.depth / 10;

  var number = document.createElement('div');
  number.className = 'number';
  number.innerHTML = htmlContent[Math.floor(Math.random() * 3)];
  var object = new THREE.CSS3DObject(number);
  object.scale.set(scaleX / 40, scaleY / 40, 1);
  object.position.copy(pos);
  object.rotation.x = -90 * math.DegToRad;

  return object;
}

exports.ServerCube.prototype.update = function(app) {
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
  if (this.tweenDirection !== tweenDirection) {
    this.tweenDirection = tweenDirection;

    if (tweenDirection === DIRECTION.IN) {
      //fade in and then show details
      app.scene2D.remove(this.cssObject);
      //remove collision object from octree to get access to the details
      app.octree.remove(this.getCollisionMesh());
      app.octree.update();
      this.setTransparency(app, {
        v: 1
      }, {
        v: 0.1
      }, 250, this.showDetails);
    } else {
      //fade out and then hide details
      this.setTransparency(app, {
        v: 0.1
      }, {
        v: 1
      }, 250, this.hideDetails);
    }
  }
};

exports.ServerCube.prototype.setTransparency = function(
  app, from, to, delay, f) {
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

exports.ServerCube.prototype.hideDetails = function(app, cube) {
  for (var i = 0; i < cube.children.length; i++) {
    app.removeObject(cube.children[i]);
  }

  app.scene2D.add(cube.cssObject);

  //add collision object to octree to enable raypicking for this cube
  app.octree.add(cube.getCollisionMesh());
  app.octree.update();
};

exports.ServerCube.prototype.showDetails = function(app, cube) {
  for (var i = 0; i < cube.children.length; i++) {
    app.addObject(cube.children[i]);
  }
};

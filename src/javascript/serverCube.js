'use strict';

var THREE = require('three.js');
var math = require('./math');
var baseCube = require('./baseCube');
var software = require('./softwareCube');
var layouter = require('./layouter2DServer');
var obj = require('./obj');
var dS = require('./detailStates');

var okImagePath = require('../images/Ok.png');
var warningImagePath = require('../images/Warning.png');
var errorImagePath = require('../images/Error.png');

require('./extensions/OBJLoader');


var DIRECTION = {
  IN: {
    id: 1
  },
  OUT: {
    id: 2
  }
};

var STATE = {
  OK: {
    id: 1,
    htmlContent: '<img src="bundle/' + okImagePath + '">'
  },
  WARNING: {
    id: 2,
    htmlContent: '<img src="bundle/' + warningImagePath + '">'
  },
  ERROR: {
    id: 3,
    htmlContent: '<img src="bundle/' + errorImagePath + '">'
  }
};

exports.ServerCube = function ServerCube(app, x, y, w, h) {
  if (app === undefined || x === undefined ||
    y === undefined || w === undefined || h === undefined) {
    return undefined;
  }
  var scaleFactor = 16;

  x *= scaleFactor;
  y *= scaleFactor;
  x += 2;
  y += 2;
  var width = scaleFactor * w - 6;
  var height = 3;
  var depth = scaleFactor * h - 6;
  baseCube.BaseCube.call(this, app, x, 0, y, width, height, depth, true);

  //set the parent mesh of the collision cube,
  //so that it can be found during the raypicking stuff
  this.collisionMesh.parentCube = this;

  //set state
  //TODO: not random :)
  var r = Math.ceil(Math.random() * 100);
  if (r > 30) {
    this.state = STATE.OK;
  } else if (r >15) {
    this.state = STATE.WARNING;
  } else {
    this.state = STATE.ERROR;
  }
  this.updateCount = 0;
  this.randomStateSwitchFactor = Math.ceil(Math.random() * 500);

  this.stateWarningSymbol = new THREE.Mesh(
    obj.stateWarningSymbol.geometry,
    obj.stateSymbolMaterial(0xFFFF00));
  setSymbolParams(this.stateWarningSymbol, x, y, width, depth);

  this.stateErrorSymbol = new THREE.Mesh(
    obj.stateErrorSymbol.geometry,
    obj.stateSymbolMaterial(0xFF0000));
  setSymbolParams(this.stateErrorSymbol, x, y, width, depth);

  this.getMesh().add(this.stateWarningSymbol);
  this.getMesh().add(this.stateErrorSymbol);


  this.layouter = new layouter.Layouter2DServer(width, depth);
  this.gridIndex = 0;
  this.grid = createGrid(width, depth);
  //a collection which stores all cubes inside this server cube
  this.softwareChildren = [];

  //this collection stores all special server materials, to be animated
  this.additionalOpacityAnimatedMaterials = [];

  //tween parameters
  this.minDistanceForTransparency = 17.5;
  this.fadeDirection = DIRECTION.OUT;

  this.detailState = app.detailState;

  //stores all materials, that are animated due to animation process
  this.opacityAnimatedMaterials = this.collectMaterials();

  //save the css stuff
  this.cssObject = createCSS3DTestStuff(this.state, app, this.dimension);
  this.setTransparency(app, {
    v: 0
  }, {
    v: 1
  }, 0);
  this.hideDetails(app, this);
  this.setState(this.state);

  this.relevantVerticesForDistanceCalulation = [];
  for (var i = 0; i < this.collisionMesh.geometry.vertices.length; i++) {
    var vertice = this.collisionMesh.geometry.vertices[i];
    //just need the upper half of the box
    if (vertice.y > 0) {
      this.relevantVerticesForDistanceCalulation.push(vertice);
    }
  }

  //register for update to calculate distance and fading
  this.registerForUpdate();
};

//inherence from SceneObject
exports.ServerCube.prototype = new baseCube.BaseCube();
exports.ServerCube.prototype.constructor = exports.ServerCube;

function setSymbolParams(object, x, y, width, depth) {
  object.rotation.x = 90 * math.DegToRad;
  object.position.set(x + width / 2, 4, -y - depth / 1.25);
}

function createGrid(width, height) {
  var gridTemp = [];

  var x = 0;
  var y = 0;
  var stepX = 3;
  var stepY = 3;
  while (y <= height - 2) {
    gridTemp.push({
      x: x,
      y: y
    });
    x += stepX;
    if (x >= width - 2) {
      x = 0;
      y += stepY;
    }
  }
  return gridTemp;
}

function createCSS3DTestStuff(state, app, dimension) {
  var content = state.htmlContent;
  var pos = new THREE.Vector3(dimension.x, dimension.y * 2, dimension.z);
  var number = document.createElement('div');
  number.className = 'serverCSS3DLayer';
  number.innerHTML = content;

  var object = new THREE.CSS3DObject(number);
  //400px in css are 1 unit in 3D space so 1*width / 400
  object.scale.set(dimension.width / 400, dimension.depth / 400, 1);
  object.position.copy(pos);
  object.rotation.x = -90 * math.DegToRad;
  //set static
  object.matrixAutoUpdate = false;
  object.updateMatrix();

  return object;
}

exports.ServerCube.prototype.setState = function(newState) {
  //set new state
  this.state = newState;

  //switch CSS3D layer
  this.cssObject.element.innerHTML = this.state.htmlContent;

  //switch 3D state symbol
  if (newState === STATE.WARNING) {
    this.stateErrorSymbol.material.visible = false;
    this.stateWarningSymbol.material.visible = true;
  } else if (newState === STATE.ERROR) {
    this.stateErrorSymbol.material.visible = true;
    this.stateWarningSymbol.material.visible = false;
  } else {
    this.stateErrorSymbol.material.visible = false;
    this.stateWarningSymbol.material.visible = false;
  }
};

exports.ServerCube.prototype.addSoftware = function(app, options) {
  try {
    //calculte next free field
    var xy = this.layouter.getNext(3, 3);
  } catch (err) {
    //console.log(err);
    return undefined;
  }
  //get dimensions of the parent server
  var dim = this.dimension;

  var xyz = {
    x: xy.x + dim.x - (dim.width / 2) + 1,
    y: dim.y - dim.height / 2,
    z: xy.y - dim.z - dim.depth / 2 + 1
  };
  //create the cube
  var swCube = new software.SoftwareCube(this, app, xyz);
  this.softwareChildren.push(swCube);

  //console.log('software added to server: ', swCube);

  return swCube;
};

exports.ServerCube.prototype.update = function(app) {
  this.updateCount++;
  if (this.updateCount % this.randomStateSwitchFactor === 0) {
    this.updateCount = 0;
    var r = Math.ceil(Math.random() * 3);
    if (r === 1) {
      //this.setState(STATE.OK);
    } else if (r === 2) {
      //this.setState(STATE.WARNING);
    } else {
      //this.setState(STATE.ERROR);
    }
  }

  //rotate statesymbol
  this.stateErrorSymbol.rotation.z += app.deltaTime * 1;
  this.stateWarningSymbol.rotation.z += app.deltaTime * 1;
  var yPos = Math.sin(app.timeSinceStarted * 3) * 0.5 + 5;
  this.stateErrorSymbol.position.y = yPos;
  this.stateWarningSymbol.position.y = yPos;


  var cam = app.mainCamera;
  var distance = getDistance(
    cam.position,
    this.relevantVerticesForDistanceCalulation,
    this.collisionMesh.position);

  //if the detail state has changed
  if (this.detailState !== app.detailState) {
    this.detailState = app.detailState;
    //do single on changed
    if (this.detailState === dS.DETAILSTATE.MID) {
      //do mid calculations
      this.setMidDetails(app);
    } else if (this.detailState === dS.DETAILSTATE.MAX) {
      //do max calculations
      this.setMaxDetails(app);
    } else {
      //do min calculations
      this.setMinDetails(app);
    }
  }

  if (this.detailState === dS.DETAILSTATE.MID ||
		this.detailState === dS.DETAILSTATE.MAX) {
    var mats = this.opacityAnimatedMaterials;
    var additionalMats = this.additionalOpacityAnimatedMaterials;
    var normZoomDistance = (app.zoomLevel) / (app.midDetailsDistance);

    for (var i = 0; i < mats.length; i++) {
      mats[i].opacity = normZoomDistance;
    }
    for (i = 0; i < additionalMats.length; i++) {
      additionalMats[i].opacity = normZoomDistance;
    }
  }


  /*
		var cam = app.mainCamera;
		var distance = getDistance(
			cam.position,
			this.relevantVerticesForDistanceCalulation,
			this.collisionMesh.position);

		if (distance < this.minDistanceForTransparency) {
			var fadeDirection = DIRECTION.IN;
		} else {
			fadeDirection = DIRECTION.OUT;
		}

		//if direction changed and object is visible
		if (this.fadeDirection !== fadeDirection) {
			this.fadeDirection = fadeDirection;

			if (fadeDirection === DIRECTION.IN) {
				//fade in and then show details
				app.scene2D.remove(this.cssObject);
				//remove collision object from octree to get access to the details
				app.octree.remove(this.getCollisionMesh());
				app.octree.update();
				this.setTransparency(app, {
					v: 1
				}, {
					v: 0.2
				}, 250, this.showDetails);
			} else {
				//fade out and then hide details
				this.setTransparency(app, {
					v: 0.2
				}, {
					v: 1
				}, 250, this.hideDetails);
			}
		}
	*/
};

exports.ServerCube.prototype.setMinDetails = function(app) {
  console.log('changed to min');
  this.hideDetails(app, this);
};

exports.ServerCube.prototype.setMidDetails = function(app) {
  this.showDetails(app, this);
  console.log('changed to mid');
};

exports.ServerCube.prototype.setMaxDetails = function(app) {
  console.log('changed to max');
};

/*
this method calculates the distance from the camera to the a given cube.
the simple method to do that is to take the center of the cube, but you get
in trouble when the cube is large, so it will fade out when you reach the edge.
to avoid this we need to calculate the distance bewteen the cam and the nearest
vertex position of the upper four vertices of the bounding box.
*/
function getDistance(from, vertices, cubePos) {
  var distance = Infinity;
  for (var i = 0; i < vertices.length; i++) {
    var vPos = new THREE.Vector3().copy(vertices[i]).add(cubePos);
    var distanceTemp = from.distanceTo(vPos);
    if (distanceTemp < distance) {
      distance = distanceTemp;
    }
  }
  return distance;
}

exports.ServerCube.prototype.setTransparency = function(
  app, from, to, delay, f) {
  //stores all materials, that are animated due to animation process
  this.opacityAnimatedMaterials = this.collectMaterials();

  //save the material!
  var mats = this.opacityAnimatedMaterials;
  var additionalMats = this.additionalOpacityAnimatedMaterials;
  var dly = delay === undefined ? 500 : delay; //default 500ms delay
  var func = f;
  var cube = this;

  //1sec animation duration
  var tween = new app.tweenEngine.Tween(from).to(to, 500);
  tween.onUpdate(function() {
    for (var i = 0; i < mats.length; i++) {
      mats[i].opacity = from.v;
    }
    for (i = 0; i < additionalMats.length; i++) {
      additionalMats[i].opacity = from.v;
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
  for (var i = 0; i < cube.softwareChildren.length; i++) {
    var child = cube.softwareChildren[i];
    if (child instanceof software.SoftwareCube) {
      child.hide();
    }
    app.removeObject(child);
  }

  app.scene2D.add(cube.cssObject);

  //add collision object to octree to enable raypicking for this cube
  app.octree.add(cube.getCollisionMesh());
  app.octree.update();
};

exports.ServerCube.prototype.showDetails = function(app, cube) {
  for (var i = 0; i < cube.softwareChildren.length; i++) {
    var child = cube.softwareChildren[i];
    if (child instanceof software.SoftwareCube) {
      child.show();
    }
    app.addObject(child);
  }
  //do it twice because the image is particulary not inserted at first try
  //happens on fast zoom in/out
  app.scene2D.remove(cube.cssObject);

  //remove collision object from octree to get access to the details
  app.octree.remove(cube.getCollisionMesh());
  app.octree.update();
};

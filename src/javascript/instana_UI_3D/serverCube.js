'use strict';

var THREE = require('three.js');
var math = require('./math');
var baseCube = require('./baseCube');
var software = require('./softwareCube');
var layouter = require('./layouter2DServer');
var obj = require('./obj');
var globalMats = require('./materials');
var dS = require('./detailStates');

var okImagePath = require('../../images/Ok.png');
var warningImagePath = require('../../images/Warning.png');
var errorImagePath = require('../../images/Error.png');

//use this object to merge each new cube into it.
//boosts extremly performance, because you don't increase draw calls
var globalMeshObjectForServer = new THREE.Mesh();
var globalMeshObjectForServerContainer = new THREE.Mesh();
globalMeshObjectForServerContainer.name = 'global container for server';
globalMeshObjectForServerContainer.matrixAutoUpdate = false;
globalMeshObjectForServerContainer.updateMatrix();

var servers = [];

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
  var width = scaleFactor * w - 4;
  var height = 3;
  var depth = scaleFactor * h - 4;
  baseCube.BaseCube.call(this, app, x, 0, y, width, height, depth);

  this.createCube(this.dimension);

  //set the parent mesh of the collision cube,
  //so that it can be found during the raypicking stuff
  this.collisionMesh.parentCube = this;
  console.log

  //set state
  //TODO: not random :)
  var r = Math.ceil(Math.random() * 100);
  if (r > 30) {
    this.state = STATE.OK;
  } else if (r > 15) {
    this.state = STATE.WARNING;
  } else {
    this.state = STATE.ERROR;
  }
  this.updateCount = 0;
  this.randomStateSwitchFactor = Math.ceil(Math.random() * 500);

  this.stateWarningSymbol = new THREE.Mesh(
    obj.stateWarningSymbol.geometry,
    globalMats.stateSymbolWarningMaterial);
  setSymbolParams(this.stateWarningSymbol, x, y, width, depth);

  this.stateErrorSymbol = new THREE.Mesh(
    obj.stateErrorSymbol.geometry,
    globalMats.stateSymbolErrorMaterial);
  setSymbolParams(this.stateErrorSymbol, x, y, width, depth);

  globalMeshObjectForServerContainer.add(this.stateWarningSymbol);
  globalMeshObjectForServerContainer.add(this.stateErrorSymbol);


  this.layouter = new layouter.Layouter2DServer(width, depth);
  this.gridIndex = 0;
  this.grid = createGrid(width, depth);
  //a collection which stores all cubes inside this server cube
  this.softwareChildren = [];

  //tween parameters
  this.minDistanceForTransparency = 17.5;
  this.fadeDirection = DIRECTION.OUT;

  this.detailState = app.detailState;

  //save the css stuff
  this.cssObject = createCSS3DTestStuff(this.state, this.dimension);
  this.hideDetails();
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

exports.ServerCube.prototype.createCube = function(dimension) {
  var width = dimension.width,
    height = dimension.height,
    depth = dimension.depth;
  var pos = new THREE.Vector3(dimension.x, dimension.y, dimension.z);

  var detCube = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth));

  detCube.position.copy(pos);
  this.setStatic(detCube);
  detCube.updateMatrix();

  //save this object, because it should be removable from the global mesh
  this.serverCube = detCube;

  servers.push(detCube);
  this.rebuildGlobalMesh();
};

exports.ServerCube.prototype.rebuildGlobalMesh = function() {
  globalMeshObjectForServerContainer.remove(globalMeshObjectForServer);

  globalMeshObjectForServer.geometry.dispose();
  var geo = new THREE.Geometry();
  for (var i = 0; i < servers.length; i++) {
    geo.merge(servers[i].geometry, servers[i].matrix);
  }
  globalMeshObjectForServer = new THREE.Mesh(geo,
    globalMats.cubeDetailedMaterial);
  globalMeshObjectForServerContainer.add(globalMeshObjectForServer);
};

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

function createCSS3DTestStuff(state, dimension) {
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

  var con = globalMeshObjectForServerContainer;

  //switch 3D state symbol
  if (newState === STATE.WARNING) {
    con.add(this.stateWarningSymbol);
    con.remove(this.stateErrorSymbol);
  } else if (newState === STATE.ERROR) {
    con.remove(this.stateWarningSymbol);
    con.add(this.stateErrorSymbol);
  } else {
    con.remove(this.stateWarningSymbol);
    con.remove(this.stateErrorSymbol);
  }
};

exports.ServerCube.prototype.update = function() {
  var app = this.appRef;

  this.updateCount++;
  if (this.updateCount % this.randomStateSwitchFactor === 0) {
    this.updateCount = 0;
    var r = Math.ceil(Math.random() * 3);
    if (r === 1) {
      this.setState(STATE.OK);
    } else if (r === 2) {
      this.setState(STATE.WARNING);
    } else {
      this.setState(STATE.ERROR);
    }
  }

  //rotate statesymbol
  this.stateErrorSymbol.rotation.z += app.deltaTime * 1;
  this.stateWarningSymbol.rotation.z += app.deltaTime * 1;
  var yPos = Math.sin(app.timeSinceStarted * 3) * 0.5 + 5;
  this.stateErrorSymbol.position.y = yPos;
  this.stateWarningSymbol.position.y = yPos;

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
};

exports.ServerCube.prototype.setMinDetails = function() {
  //console.log('changed to min');
  this.hideDetails();
};

exports.ServerCube.prototype.setMidDetails = function() {
  this.showDetails();
  //console.log('changed to mid');
};

exports.ServerCube.prototype.setMaxDetails = function() {
  //console.log('changed to max');
};

exports.ServerCube.prototype.hideDetails = function() {
  var app = this.appRef;

  for (var i = 0; i < this.softwareChildren.length; i++) {
    var child = this.softwareChildren[i];
    if (child instanceof software.SoftwareCube) {
      child.hide();
    }
  }

  app.scene2D.add(this.cssObject);

  //add collision object to octree to enable raypicking for this cube
  app.octree.add(this.getCollisionMesh());
  app.octree.update();
};

exports.ServerCube.prototype.showDetails = function() {
  var app = this.appRef;

  for (var i = 0; i < this.softwareChildren.length; i++) {
    var child = this.softwareChildren[i];
    if (child instanceof software.SoftwareCube) {
      child.show();
    }
  }
  //do it twice because the image is particulary not inserted at first try
  //happens on fast zoom in/out
  app.scene2D.remove(this.cssObject);

  //remove collision object from octree to get access to the details
  app.octree.remove(this.getCollisionMesh());
  app.octree.update();
};

exports.ServerCube.prototype.addSoftware = function(options) {
  var cubeWidth = 3;
  var cubeHeight = 3;

  try {
    //calculte next free field
    var xy = this.layouter.getNext(cubeWidth, cubeHeight);
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
  var swCube = new software.SoftwareCube(this, this.appRef, xyz);
  this.softwareChildren.push(swCube);

  //say the layouter, that the area should be blocked
  this.layouter.setBlocked(xy, cubeWidth, cubeHeight, swCube.name);
  return swCube;
};

exports.ServerCube.prototype.removeSoftware = function(softwareCube) {
  softwareCube.destroy();
};

exports.ServerCube.prototype.softwareRemoved = function(softwareCube) {
  this.softwareChildren = this.softwareChildren.filter(item => item !==
    softwareCube);

  //set the layouter free from the removed cube so the space can be used anymore
  this.layouter.setFree(softwareCube.name);
}

exports.ServerCube.prototype.destroy = function() {
  //destroy children
  var children = this.softwareChildren.slice();
  for (var i = 0; i < children.length; i++) {
    this.removeSoftware(children[i]);
  }

  //free resources
  this.appRef.scene2D.remove(this.cssObject);
  globalMeshObjectForServerContainer.remove(this.stateWarningSymbol);
  globalMeshObjectForServerContainer.remove(this.stateErrorSymbol);

  //rebuild global combined mesh
  servers = servers.filter(item => item !== this.serverCube);
  this.rebuildGlobalMesh();

  this.appRef.layouter.setFree(this.name);

  //finally remove the baseCube stuff
  this.dispose();
};

exports.getGlobalObject = function() {
	return globalMeshObjectForServerContainer;
};

//the global update method to calculate things for the combined mesh or
//stuff that has to be calculated for every cube
exports.update = function(app) {
  if (app.detailState === dS.DETAILSTATE.MID ||
    app.detailState === dS.DETAILSTATE.MAX) {
    globalMats.cubeDetailedMaterial.transparent = true;
    globalMats.stateSymbolWarningMaterial.transparent = true;
    globalMats.stateSymbolErrorMaterial.transparent = true;

    globalMats.cubeSimpleMaterial.visible = true;

    var normZoomDistance = (app.zoomLevel) / (app.midDetailsDistance);
    globalMeshObjectForServer.material.opacity = normZoomDistance;
    globalMats.stateSymbolWarningMaterial.opacity = normZoomDistance;
    globalMats.stateSymbolErrorMaterial.opacity = normZoomDistance;
  } else {
    globalMats.cubeDetailedMaterial.transparent = false;
    globalMats.stateSymbolWarningMaterial.transparent = false;
    globalMats.stateSymbolErrorMaterial.transparent = false;

    globalMats.cubeSimpleMaterial.visible = false;
  }
};


/*
	var tween = new app.tweenEngine.Tween(from).to(to, 1000);
	tween.onUpdate(function() {
	});
	tween.onComplete(function() {
	});

	tween.start();
	tween.easing(app.tweenEngine.Easing.Cubic.InOut);
};
*/

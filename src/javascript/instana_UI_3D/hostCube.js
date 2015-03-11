'use strict';

var THREE = require('three.js');
var math = require('./math');
var baseCube = require('./baseCube');
var containerCube = require('./containerCube');
var materials = require('./materials');
var dS = require('./detailStates');
var geometries = require('./geometries');

var dataProvider = require('./dataProvider/hostDataProvider');

//use this object to merge each new cube into it.
//boosts extremly performance, because you don't increase draw calls
var globalMeshForHosts = new THREE.Mesh();
exports.globalMeshObjectForServerContainer = new THREE.Mesh();
exports.globalMeshObjectForServerContainer.name = 'global container for hosts';
exports.globalMeshObjectForServerContainer.matrixAutoUpdate = false;

var hosts = [];

exports.STATE = {
  OK: {},
  WARNING: {},
  ERROR: {}
};

exports.HostCube = function HostCube(app, x, y, w, h, metaData) {
  if (app === undefined || x === undefined ||
    y === undefined || w === undefined || h === undefined) {
    return undefined;
  }

  var meta = this.extractMetadata(metaData);
  var id = meta.id;
  this.cpu = meta.cpu;
  this.memory = meta.memory;

  /*
	    x	________  x
			x |	 				 		| x
			x |  				 		| x
		  x |___w___| x
		  x x x x x x x x

			x = cubeOffset
			w = witdh * scaleFactor - 2x
	*/
  var cubeOffset = 2;
  var scaleFactor = 16;
  var x = x * scaleFactor + cubeOffset;
  var y = y * scaleFactor - cubeOffset;
  var width = w * scaleFactor - (cubeOffset * 2);
  var depth = h * scaleFactor - (cubeOffset * 2);

  //call super contructor
  var provider = new dataProvider.HostDataProvider();
  baseCube.BaseCube.call(this, provider, app, x, 0, y, width, 3, depth, id);

  this.createCube();

  //set the parent mesh of the collision cube,
  //so that it can be found during the raypicking stuff
  this.collisionMesh.parentCube = this;

  this.detailState = app.detailState;

  //save the css stuff
  this.cssObject = this.dataProvider.content2D;
  this.hideDetails();

  //set state
  this.state = exports.STATE.OK;
  this.setState(this.state);
  this.updateCount = 0;
  this.randomStateSwitchFactor = Math.ceil(Math.random() * 500 + 100);

  //register for update to calculate distance and fading
  this.registerForUpdate();
};

//inherence from SceneObject
exports.HostCube.prototype = new baseCube.BaseCube();
exports.HostCube.prototype.constructor = exports.HostCube;


exports.HostCube.prototype.extractMetadata = function(metaData) {
  var meta = {
    id: '',
    cpu: '',
    memory: ''
  };

  if (metaData !== undefined) {
    //backend uuid
    meta.id = metaData.id;
    //cpu cores times cpu speed
    meta.cpu = metaData.cpu.count + 'x ' + metaData.cpu.model;
    //Byte -> MB
    meta.memory = Math.round(metaData.memory.total / 1000000) + 'MB RAM';
  } else {
    meta.id = math.guid();
    meta.cpu = 'not available';
    meta.memory = 'not available';
  }

  return meta;
};

exports.HostCube.prototype.createCube = function(dimension) {
  var detCube = this.dataProvider.visibleMesh;
  this.setStatic(detCube);

  //save this object, because it should be removable from the global mesh
  this.visibleCube = detCube;

	//you need all cubes to rebuild the global mesh
  hosts.push(detCube);
  this.rebuildGlobalMesh();
};

exports.HostCube.prototype.rebuildGlobalMesh = function() {
  exports.globalMeshObjectForServerContainer.remove(globalMeshForHosts);
  globalMeshForHosts.geometry.dispose();

  if(hosts.length < 1) {
    return;
  }

  var geo = new THREE.Geometry();
  for (var i = 0; i < hosts.length; i++) {
    geo.merge(hosts[i].geometry, hosts[i].matrix);
  }
  globalMeshForHosts = new THREE.Mesh(
		new THREE.BufferGeometry().fromGeometry(geo),
    materials.cubeDetailedMaterial);

	geo.dispose();
  exports.globalMeshObjectForServerContainer.add(globalMeshForHosts);
};

exports.HostCube.prototype.setState = function(newState) {
  //set new state
  this.state = newState;
  this.dataProvider.setState(newState);
};

exports.HostCube.prototype.update = function() {
  var app = this.appRef;

  this.updateCount++;
  if (this.updateCount % this.randomStateSwitchFactor === 0) {
    this.updateCount = 0;
    var r = Math.ceil(Math.random() * 3);
    if (r === 1) {
      this.setState(exports.STATE.OK);
    } else if (r === 2) {
      this.setState(exports.STATE.WARNING);
    } else {
      this.setState(exports.STATE.ERROR);
    }
  }

  //if the detail state has changed
  if (this.detailState !== app.detailState) {
    this.detailState = app.detailState;
    //do single on changed
    if (this.detailState === dS.DETAILSTATE.MID) {
      //do mid calculations
      this.showDetails();
    } else if (this.detailState === dS.DETAILSTATE.MAX) {
      //do max calculations
    } else {
      //do min calculations
      this.hideDetails();
    }
  }
};

exports.HostCube.prototype.hideDetails = function() {
  var app = this.appRef;

  for (var i = 0; i < this.containerChildren.length; i++) {
    var child = this.containerChildren[i];
    if (child instanceof containerCube.ContainerCube) {
      child.hide();
    }
  }

  app.scene2D.add(this.cssObject);

  //add collision object to octree to enable raypicking for this cube
  app.octree.add(this.getCollisionMesh());
  app.octree.update();
};

exports.HostCube.prototype.showDetails = function() {
  var app = this.appRef;

  for (var i = 0; i < this.containerChildren.length; i++) {
    var child = this.containerChildren[i];
    if (child instanceof containerCube.ContainerCube) {
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

exports.HostCube.prototype.addContainer = function(metaData) {
	var width = 3;
	var depth = 3;
	var pos = this.nextContainerPosition(width, depth);
	if(pos === undefined) {
		return;
	}

  //create the container
  var container = new containerCube.ContainerCube(this, pos.pos, metaData);
  this.containerChildren.push(container);

  //say the layouter, that the area should be blocked
  this.layouter.setBlocked(pos.xy, width, depth, container.name);
  return container;
};

exports.HostCube.prototype.dispose = function() {
  //free resources
  this.appRef.scene2D.remove(this.cssObject);

  //rebuild global combined mesh
  hosts = hosts.filter(item => item !== this.visibleCube);
  this.rebuildGlobalMesh();

  this.appRef.layouter.setFree(this.name);

  //finally remove the baseCube stuff
  this.disposeBaseCube();

  this.cpu = null;
  this.memory = null;
  this.state = null;
  this.updateCount = null;
  this.randomStateSwitchFactor = null;
  this.layouter = null;
  this.containerChildren = null;
  this.detailState = null;
  this.cssObject = null;
};

//the global update method to calculate things for the combined mesh or
//stuff that has to be calculated for every cube
exports.update = function(app) {
  if (app.detailState === dS.DETAILSTATE.MID ||
    app.detailState === dS.DETAILSTATE.MAX) {
    materials.cubeDetailedMaterial.transparent = true;
    materials.stateSymbolWarningMaterial.transparent = true;
    materials.stateSymbolErrorMaterial.transparent = true;

    materials.cubeSimpleMaterial.visible = true;

    var normZoomDistance = (app.zoomLevel) / (app.midDetailsDistance);
    globalMeshForHosts.material.opacity = normZoomDistance;
    materials.stateSymbolWarningMaterial.opacity = normZoomDistance;
    materials.stateSymbolErrorMaterial.opacity = normZoomDistance;
  } else {
    materials.cubeDetailedMaterial.transparent = false;
    materials.stateSymbolWarningMaterial.transparent = false;
    materials.stateSymbolErrorMaterial.transparent = false;

    materials.cubeSimpleMaterial.visible = false;
  }
};

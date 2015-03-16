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
exports.globalMeshObjectForServerContainer = new THREE.Mesh();
exports.globalMeshObjectForServerContainer.name = 'global container for hosts';
exports.globalMeshObjectForServerContainer.matrixAutoUpdate = false;

var hosts = [];

exports.STATE = {
  OK: { id:'ok' },
  WARNING: { id:'warning' },
  ERROR: { id:'error' }
};

exports.HostCube = function HostCube(app, x, y, w, h, metaData) {
  if (app === undefined || x === undefined ||
    y === undefined || w === undefined || h === undefined) {
    return undefined;
  }

  var meta = this.extractMetadata(metaData);
  this.changeMetadata(metaData);
  var id = meta.id;

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

  //register for update to calculate distance and fading
  this.registerForUpdate();
};

//inherence from SceneObject
exports.HostCube.prototype = new baseCube.BaseCube();
exports.HostCube.prototype.constructor = exports.HostCube;


exports.HostCube.prototype.setColorFromMetadata = function(metaData) {
  //set state
  var maxError = 'GREEN';
  if(metaData.colors !== undefined) {
    for (var i = 0; i < metaData.colors.length; i++) {
      var color = metaData.colors[i];
      maxError = color[Object.keys(color)[0]];
    }
  }

  if(maxError === 'GREEN') {
    this.state = exports.STATE.OK;
    this.setState(this.state);
  } else if(maxError === 'YELLOW') {
    this.state = exports.STATE.WARNING;
    console.log('set state to warning');
    this.setState(this.state);
  } else if(maxError === 'RED') {
    this.state = exports.STATE.ERROR;
    console.log('set state to warning');
    this.setState(this.state);
  }
};

exports.HostCube.prototype.extractMetadata = function(metaData) {
  var meta = { id: math.guid() };

  if(metaData === undefined) { return meta; }
  if(metaData.id !== undefined) { meta.id = metaData.id; }
  if(metaData.cpu !== undefined) {
    meta.cpu = metaData.cpu.count + 'x ' + metaData.cpu.model;
  }
  if(metaData.memory !== undefined) {
    meta.memory = Math.round((metaData.memory.total / 1073741824) *100) / 100 + ' GB RAM';
  }
  if(metaData.operatingSystem !== undefined) {
    meta.operatingSystem = metaData.operatingSystem.name + ' - '
    + metaData.operatingSystem.version;
  }
  if(metaData.colors !== undefined) {
    meta.colors = metaData.colors;
  }

  return meta;
};

exports.HostCube.prototype.changeMetadata = function(metaData) {
  var meta = this.extractMetadata(metaData);

  //set state
  this.setColorFromMetadata(meta);

  this.cpu = meta.cpu;
  this.memory = meta.memory;
  this.operatingSystem = meta.operatingSystem;
};

exports.HostCube.prototype.setState = function(newState) {
  //set new state
  this.state = newState;
  if(this.dataProvider !== undefined) {
    this.dataProvider.setState(newState);
  }
};

exports.HostCube.prototype.createCube = function(dimension) {
  var detCube = this.dataProvider.visibleMesh;
  this.setStatic(detCube);

  //save this object, because it should be removable from the global mesh
  this.visibleCube = detCube;

	//you need all cubes to rebuild the global mesh
  hosts.push(this);
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
    var cube = hosts[i].visibleCube;
    geo.merge(cube.geometry, cube.matrix);
  }
  globalMeshForHosts = new THREE.Mesh(
		new THREE.BufferGeometry().fromGeometry(geo),
    materials.cubeDetailedMaterial);

	geo.dispose();
  exports.globalMeshObjectForServerContainer.add(globalMeshForHosts);
};

exports.HostCube.prototype.update = function() {
  var app = this.appRef;

  //if the detail state has changed
  if (this.detailState !== app.detailState) {
    this.detailState = app.detailState;
    //do single on changed
    if (this.detailState === dS.DETAILSTATE.MID ||
    this.detailState === dS.DETAILSTATE.MAX) {
      //do mid calculations
      this.showDetails();
    } else {
      //do min calculations
      this.hideDetails();
    }
  }

  this.dataProvider.update();
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
  var containerWithSamePID = undefined;
  for (var i = 0; i < this.containerChildren.length; i++) {
    if(this.containerChildren[i].pid === metaData.pid) {
      containerWithSamePID = this.containerChildren[i];
    }
  }

  if(containerWithSamePID !== undefined) {
    return containerWithSamePID.stackContainer(metaData);

  } else{
    //add as new container
  	var width = 4;
  	var depth = 4;
  	var pos = this.nextContainerPosition(width, depth);
  	if(pos === undefined) {
  		return;
  	}

    //create the container
    if(metaData.pid !== undefined) {
      metaData.discription += ' - ' + metaData.pid;
    }

    var container = new containerCube.ContainerCube(this, pos.pos, metaData);
    this.containerChildren.push(container);

    //say the layouter, that the area should be blocked
    this.layouter.setBlocked(pos.xy, width, depth, container.name);
    return container;
  }
};

exports.HostCube.prototype.dispose = function() {
  //free resources
  this.appRef.scene2D.remove(this.cssObject);

  //rebuild global combined mesh
  hosts = hosts.filter(item => item !== this);
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

exports.findByName = function(name) {
  for (var i = 0; i < hosts.length; i++) {
    var host = hosts[i];
    if(host.name === name) {
      return host;
    }
  }
  return undefined;
};

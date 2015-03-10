'use strict';

var THREE = require('three.js');
var math = require('./math');
var baseCube = require('./baseCube');
var containerCube = require('./containerCube');
var layouter = require('./layouter2DServer');
var obj = require('./obj');
var globalMats = require('./materials');
var dS = require('./detailStates');
var geometries = require('./geometries');

var dataProvider = require('./dataProvider/hostDataProvider');

//use this object to merge each new cube into it.
//boosts extremly performance, because you don't increase draw calls
var globalMeshObjectForServer = new THREE.Mesh();
exports.globalMeshObjectForServerContainer = new THREE.Mesh();
exports.globalMeshObjectForServerContainer.name = 'global container for hosts';
exports.globalMeshObjectForServerContainer.matrixAutoUpdate = false;
exports.globalMeshObjectForServerContainer.updateMatrix();

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
	var scaleFactor = 16;
	x *= scaleFactor;
	y *= scaleFactor;
	var width = scaleFactor * w - 4;
	var height = 3;
	var depth = scaleFactor * h - 4;

	if (metaData !== undefined) {
		var id = metaData.id;
		this.cpu = metaData.cpu.count + 'x ' + metaData.cpu.model;
		this.memory = Math.round(metaData.memory.total / 1000000) + 'MB RAM'; //Byte -> MB
	} else {
		var id = math.guid();
		this.cpu = 'not available';
		this.memory = 'not available';
	}

	//call super contructor
	var provider = new dataProvider.HostDataProvider();
	baseCube.BaseCube.call(this, provider, app, x, 0, y, width, height, depth, id);

	this.createCube();

	//set the parent mesh of the collision cube,
	//so that it can be found during the raypicking stuff
	this.collisionMesh.parentCube = this;

	//set state
	//TODO: not random :)
	var r = Math.max(Math.ceil(Math.random() * 100), 2);
	if (r > 30) {
		this.state = exports.STATE.OK;
	} else if (r > 15) {
		this.state = exports.STATE.WARNING;
	} else {
		this.state = exports.STATE.ERROR;
	}
	this.updateCount = 0;
	this.randomStateSwitchFactor = Math.ceil(Math.random() * 500);

	//the layouter for the softwareCubes
	this.layouter = new layouter.Layouter2DServer(width, depth);
	this.gridIndex = 0;
	//a collection which stores all cubes inside this server cube
	this.containerChildren = [];

	this.detailState = app.detailState;

	//save the css stuff
	this.cssObject = this.dataProvider.content2D;
	this.hideDetails();
	this.setState(this.state);

	//register for update to calculate distance and fading
	this.registerForUpdate();
};

//inherence from SceneObject
exports.HostCube.prototype = new baseCube.BaseCube();
exports.HostCube.prototype.constructor = exports.HostCube;


exports.HostCube.prototype.createCube = function(dimension) {
	var detCube = this.dataProvider.visibleMesh;

	this.setStatic(detCube);

	//save this object, because it should be removable from the global mesh
	this.hostCube = detCube;

	hosts.push(detCube);
	this.rebuildGlobalMesh();
};

exports.HostCube.prototype.rebuildGlobalMesh = function() {
	exports.globalMeshObjectForServerContainer.remove(globalMeshObjectForServer);

	globalMeshObjectForServer.geometry.dispose();
	var geo = new THREE.Geometry();
	for (var i = 0; i < hosts.length; i++) {
		geo.merge(hosts[i].geometry, hosts[i].matrix);
	}
	globalMeshObjectForServer = new THREE.Mesh(geo,
		globalMats.cubeDetailedMaterial);
	exports.globalMeshObjectForServerContainer.add(globalMeshObjectForServer);
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

exports.HostCube.prototype.setMinDetails = function() {
	//console.log('changed to min');
	this.hideDetails();
};

exports.HostCube.prototype.setMidDetails = function() {
	this.showDetails();
	//console.log('changed to mid');
};

exports.HostCube.prototype.setMaxDetails = function() {
	//console.log('changed to max');
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

exports.HostCube.prototype.addSoftware = function(options) {
	var cubeWidth = 3;
	var cubeHeight = 3;

	try {
		//calculte next free field
		var xy = this.layouter.getNext(cubeWidth, cubeHeight);
	} catch (err) {
		console.log(err);
		return undefined;
	}
	//get dimensions of the parent server
	var dim = this.dimension;
	var pos = this.position;

	var xyz = {
		x: xy.x + pos.x,
		y: pos.y,
		z: -xy.y - pos.z
	};

	//create the cube
	var swCube = new containerCube.ContainerCube(this, this.appRef, xyz, options.id);
	this.containerChildren.push(swCube);

	//say the layouter, that the area should be blocked
	this.layouter.setBlocked(xy, cubeWidth, cubeHeight, swCube.name);
	return swCube;
};

exports.HostCube.prototype.removeSoftware = function(softwareCube) {
	softwareCube.dispose();
};

exports.HostCube.prototype.softwareRemoved = function(softwareCube) {
	this.containerChildren = this.containerChildren.filter(item => item !==
		softwareCube);

	//set the layouter free from the removed cube so the space can be used anymore
	this.layouter.setFree(softwareCube.name);
}

exports.HostCube.prototype.dispose = function() {
	//destroy children
	var children = this.containerChildren.slice();
	for (var i = 0; i < children.length; i++) {
		this.removeSoftware(children[i]);
	}

	//free resources
	this.appRef.scene2D.remove(this.cssObject);

	//rebuild global combined mesh
	hosts = hosts.filter(item => item !== this.hostCube);
	this.rebuildGlobalMesh();

	this.appRef.layouter.setFree(this.name);

	//finally remove the baseCube stuff
	this.disposeBaseCube();

	delete this.cpu;
	delete this.memory;
	delete this.state;
	delete this.updateCount;
	delete this.randomStateSwitchFactor;
	delete this.layouter;
	delete this.gridIndex;
	delete this.containerChildren;
	delete this.detailState;
	delete this.cssObject;
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

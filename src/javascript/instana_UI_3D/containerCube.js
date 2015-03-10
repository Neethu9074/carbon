'use strict';

var THREE = require('three.js');
var math = require('./math');
var baseCube = require('./baseCube');
var mats = require('./materials');
var dS = require('./detailStates');
var geometries = require('./geometries');

var dataProvider = require('./dataProvider/containerDataProvider');

exports.ContainerCube = function ContainerCube(serverCube, app, xyz, id) {
	if (app === undefined || xyz === undefined) {
		return undefined;
	}

  //call super contructor
  var provider = new dataProvider.ContainerDataProvider();
	baseCube.BaseCube.call(this, provider, app, xyz.x, xyz.y, xyz.z, 2, 0.4, 2, id);

  this.setMesh(this.createCube());
	this.collisionMesh.parentCube = this;

	//set the parent mesh of the collision cube,
	//so that it can be found during the raypicking stuff
	this.collisionMesh.parentCube = this;

	//the parent server or container, where the container belongs to
	this.parent = serverCube;

	//in this collection higher level softwareCubes will be stored
	this.stackedsoftware = [];

	this.cssObject = this.dataProvider.createCSS3DTestStuff();

	//if the appRef is zoomed in, the new container should be visible
	if(this.appRef.detailState === dS.DETAILSTATE.MAX ||
		this.appRef.detailState === dS.DETAILSTATE.MID) {
		this.show();
	} else {
		this.hide();
	}
};

//inherence from SceneObject
exports.ContainerCube.prototype = new baseCube.BaseCube();
exports.ContainerCube.prototype.constructor = exports.ContainerCube;

exports.ContainerCube.prototype.createCube = function() {
	var cube = this.dataProvider.createVisibleMesh();
	this.setStatic(cube);
	return cube;
};

exports.ContainerCube.prototype.hide = function() {
	//add the 2D overlay from seperate scene
	this.appRef.scene2D.remove(this.cssObject);
	for (var i = 0; i < this.stackedsoftware.length; i++) {
		this.stackedsoftware[i].hide();
	}

	this.appRef.scene.remove(this.getMesh());

	//remove collision object from octree to get access to the details
	this.appRef.octree.remove(this.getCollisionMesh());
	this.appRef.octree.update();
};

exports.ContainerCube.prototype.show = function() {
	//add the 2D overlay from seperate scene
	this.appRef.scene2D.add(this.cssObject);
	for (var i = 0; i < this.stackedsoftware.length; i++) {
		this.stackedsoftware[i].show();
	}

	this.appRef.scene.add(this.getMesh());

	//remove collision object from octree to get access to the details
	this.appRef.octree.add(this.getCollisionMesh());
	this.appRef.octree.update();
};

exports.ContainerCube.prototype.addSoftware = function(options) {
	//get dimensions of the parent server
	var dim = this.dimension;
	var pos = this.position;

	var xyz = {
		x:  pos.x,
		y: pos.y + dim.y + 0.1,
		z: pos.z
	};

	//create the cube
	var swCube = new exports.ContainerCube(this, this.appRef, xyz, 'd');
	this.stackedsoftware.push(swCube);

	return swCube;
};

exports.ContainerCube.prototype.removeSoftware = function(softwareCube) {
	softwareCube.dispose();
};

exports.ContainerCube.prototype.softwareRemoved = function(softwareCube) {
	this.stackedsoftware = this.stackedsoftware.filter(item => item !== softwareCube);
}

exports.ContainerCube.prototype.dispose = function() {
	//remove all stacked container as well
	var children =  this.stackedsoftware.slice();
	for (var i = 0; i < children.length; i++) {
		this.removeSoftware(children[i]);
	}

	//remove the 2D overlay from seperate scene
	this.appRef.scene2D.remove(this.cssObject);

	//remove collision object from octree to get access to the details
	this.appRef.octree.remove(this.getCollisionMesh());
	this.appRef.octree.update();

	this.appRef.scene.remove(this.getMesh());

	this.disposeBaseCube();
	this.parent.softwareRemoved(this);

	delete this.parent;
	delete this.stackedsoftware;
	delete this.cssObject;
};

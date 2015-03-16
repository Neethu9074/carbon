'use strict';

var THREE = require('three.js');
var baseCube = require('./baseCube');
var mats = require('./materials');
var dS = require('./detailStates');
var geometries = require('./geometries');

var daProv = require('./dataProvider/containerDataProvider');


exports.ContainerCube = function ContainerCube(serverCube, pos, w, d, metaData) {
	if (serverCube === undefined || pos === undefined) {
		return undefined;
	}
	var app = serverCube.appRef;
	var id = metaData.id;

  //create the container
  if(metaData.pid !== undefined) {
    metaData.discription += ' - ' + metaData.pid;
  }

	this.pid = metaData.pid;
  this.tag = metaData.tag;
  this.entityId = metaData.entityId;
	this.discription = metaData.discription;
  this.host = metaData.host;

	if(!(serverCube instanceof exports.ContainerCube)){
	  this.offset = 0.1 * w;
	  var x = pos.x + this.offset;
	  var z = pos.z - this.offset;//remember negative webGL z space
	  var width = w - this.offset * 2;
	  var depth = d - this.offset * 2;
	} else {
		 var x = pos.x;
	  var z = pos.z; //remember negative webGL z space
	  var width = w;
	  var depth = d;
	}

  //call super contructor
  var provider = new daProv.ContainerDataProvider();
	baseCube.BaseCube.call(this, provider, app, x, pos.y, z, width, 0.5, depth, id);

  this.setMesh(this.createCube());
	this.collisionMesh.parentCube = this;

	//set the parent mesh of the collision cube,
	//so that it can be found during the raypicking stuff
	this.collisionMesh.parentCube = this;

	//the parent server or container, where the container belongs to
	this.parent = serverCube;

	//in this collection higher level softwareCubes will be stored
	this.stackedContainer = [];

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
	for (var i = 0; i < this.stackedContainer.length; i++) {
		this.stackedContainer[i].hide();
	}

	this.appRef.scene.remove(this.getMesh());

	//remove collision object from octree to get access to the details
	this.appRef.octree.remove(this.getCollisionMesh());
	this.appRef.octree.update();
};

exports.ContainerCube.prototype.show = function() {
	//add the 2D overlay from seperate scene
	this.appRef.scene2D.add(this.cssObject);
	for (var i = 0; i < this.stackedContainer.length; i++) {
		this.stackedContainer[i].show();
	}

	this.appRef.scene.add(this.getMesh());

	//remove collision object from octree to get access to the details
	this.appRef.octree.add(this.getCollisionMesh());
	this.appRef.octree.update();
};

exports.ContainerCube.prototype.stackContainer = function(metaData) {
	//for demo purpose only
	if(this.stackedContainer.length > 0) {
		return this.stackedContainer[0].stackContainer(metaData);
	}

	//get dimensions of the parent server
	var dim = this.dimension;
	var pos = this.position;

	var xyz = {
		x:  pos.x,
		y: pos.y + dim.y + 0.1,
		z: pos.z + - 0.25
	};

	//create the cube
	var swCube = new exports.ContainerCube(this, xyz, dim.x, dim.z, metaData);
	this.stackedContainer.push(swCube);

	return swCube;
};

exports.ContainerCube.prototype.addContainer = function(options) {
	console.log('add a container inside. NOT SUPPORTED YET');
};

exports.ContainerCube.prototype.removeContainer = function(container) {
	container.dispose();
};

exports.ContainerCube.prototype.containerRemoved = function(container) {
	this.stackedContainer = this.stackedContainer.filter(item => item !== container);
}

exports.ContainerCube.prototype.dispose = function() {
	//remove all stacked container as well. no javaapp without JVM
	var children =  this.stackedContainer.slice();
	for (var i = 0; i < children.length; i++) {
		this.removeContainer(children[i]);
	}

	//remove the 2D overlay from seperate scene
	this.appRef.scene2D.remove(this.cssObject);

	//remove collision object from octree to get access to the details
	this.appRef.octree.remove(this.getCollisionMesh());
	this.appRef.octree.update();

	this.appRef.scene.remove(this.getMesh());

	this.parent.containerRemoved(this);
	this.disposeBaseCube();

	this.parent = null;
	this.stackedContainer = null;
	this.cssObject = null;
};



exports.ContainerCube.prototype.setDimension = function(width, depth) {
  this.offset = 0.1 * width;
  width -= this.offset * 2;
  depth -= this.offset * 2;

  this.setDimensionBaseCube(width, depth);

  //scale stacked children
	for (var i = 0; i < this.stackedContainer.length; i++) {
		this.stackedContainer[i].setDimension(width, depth);
	}
};

exports.ContainerCube.prototype.setPosition = function(pos) {
  pos.x += this.offset;
  pos.z -= this.offset;//remember negative webGL z space

  this.setPositionBaseCube(pos);

  //move stacked children
	for (var i = 0; i < this.stackedContainer.length; i++) {
		var container = this.stackedContainer[i];
		var containerPos = container.position;
		var targetPos = pos.clone();
		targetPos.y = containerPos.y;
		container.setPosition(targetPos);
	}
};

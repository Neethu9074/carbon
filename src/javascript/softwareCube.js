'use strict';

var THREE = require('three.js');
var math = require('./math');
var baseCube = require('./baseCube');
var softwareCube = require('./softwareCube');
var mats = require('./materials');
var dS = require('./detailStates');

//use this object to merge each new cube into it.
//boosts extremly performance, because you don't increase draw calls
//use this object to merge each new cube into it.
//boosts extremly performance, because you don't increase draw calls
var globalMeshObjectForSoftware = new THREE.Mesh();
var globalMeshObjectForSoftwareContainer = new THREE.Mesh();
var software = [];
var globalMeshWasSet = false;

exports.SoftwareCube = function SoftwareCube(serverCube, app, xyz) {
	if (app === undefined || xyz === undefined) {
		return undefined;
	}
	baseCube.BaseCube.call(this, app, xyz.x, xyz.y, xyz.z, 2, 0.4, 2);

	this.app = app;

	//first, add the global object to the app
	if(!globalMeshWasSet){
		globalMeshObjectForSoftwareContainer.name = name;
		this.setStatic(globalMeshObjectForSoftwareContainer);
		app.scene.add(globalMeshObjectForSoftwareContainer);
		globalMeshWasSet = true;
	}

  this.createCube(this.dimension);
	this.collisionMesh.parentCube = this;

	//set the parent mesh of the collision cube,
	//so that it can be found during the raypicking stuff
	this.collisionMesh.parentCube = this;

	//the parent server or software, where the software belongs to
	this.parent = serverCube;

	//in this collection higher level softwareCubes will be stored
	this.stackedsoftware = [];

	this.cssObject = createCSS3DTestStuff(this.dimension, 'Apache 2.4');

	//if the app is zoomed in, the new software should be visible
	if(this.appRef.detailState === dS.DETAILSTATE.MAX ||
		this.appRef.detailState === dS.DETAILSTATE.MID) {
		this.show();
	} else {
		this.hide();
	}
};

//inherence from SceneObject
exports.SoftwareCube.prototype = new baseCube.BaseCube();
exports.SoftwareCube.prototype.constructor = exports.SoftwareCube;

exports.SoftwareCube.prototype.createCube = function(dimension) {
  var width = dimension.width,
    height = dimension.height,
    depth = dimension.depth;
  var pos = new THREE.Vector3(dimension.x, dimension.y, dimension.z);

	var cube = new THREE.Mesh(
		new THREE.BoxGeometry(width, height, depth),
		mats.cubeSimpleMaterial);

	cube.position.copy(pos);
	this.setStatic(cube);
	cube.updateMatrix();

	//save this object, because it should be removable from the global mesh
	this.softwareCube = cube;

	software.push(cube);
	this.rebuildGlobalMesh();
};

exports.SoftwareCube.prototype.rebuildGlobalMesh = function() {
	globalMeshObjectForSoftwareContainer.remove(globalMeshObjectForSoftware);

	globalMeshObjectForSoftware.geometry.dispose();
	var geo = new THREE.Geometry();
	for (var i = 0; i < software.length; i++) {
		geo.merge(software[i].geometry, software[i].matrix);
	}
	globalMeshObjectForSoftware = new THREE.Mesh(geo,
		mats.cubeSimpleMaterial);
	globalMeshObjectForSoftwareContainer.add(globalMeshObjectForSoftware);
};

exports.SoftwareCube.prototype.hide = function() {
	//add the 2D overlay from seperate scene
	this.app.scene2D.remove(this.cssObject);
	for (var i = 0; i < this.stackedsoftware.length; i++) {
		this.stackedsoftware[i].hide();
	}

	//remove collision object from octree to get access to the details
	this.app.octree.remove(this.getCollisionMesh());
	this.app.octree.update();
};

exports.SoftwareCube.prototype.show = function() {
	//add the 2D overlay from seperate scene
	this.app.scene2D.add(this.cssObject);
	for (var i = 0; i < this.stackedsoftware.length; i++) {
		this.stackedsoftware[i].show();
	}

	//remove collision object from octree to get access to the details
	this.app.octree.add(this.getCollisionMesh());
	this.app.octree.update();
};

function createCSS3DTestStuff(dimension, name) {
	var content = name;
	var pos = new THREE.Vector3(
		dimension.x,
		dimension.y + dimension.height / 2,
		dimension.z);
	pos.z += dimension.depth / 2 - 0.2;

	var number = document.createElement('div');
	number.className = 'softwareCSS3DLayer';
	number.innerHTML = content;
	var object = new THREE.CSS3DObject(number);
	object.scale.set(1 / 110, 1 / 100, 1);
	object.position.copy(pos);
	object.rotation.x = -90 * math.DegToRad;

	//set static
	object.matrixAutoUpdate = false;
	object.updateMatrix();

	return object;
}

exports.SoftwareCube.prototype.addSoftware = function(options) {
	//get dimensions of the parent server
	var dim = this.dimension;

	var xyz = {
		x: 0,
		y: dim.y + dim.height / 2,
		z: 0.5
	};
	xyz.x += dim.x - (dim.width / 2);
	xyz.z -= dim.z + (dim.depth / 2);

	//create the cube
	var swCube = new softwareCube.SoftwareCube(this, this.app, xyz);
	this.stackedsoftware.push(swCube);

	return swCube;
};

exports.SoftwareCube.prototype.removeSoftware = function(softwareCube) {
	softwareCube.destroy();
};

exports.SoftwareCube.prototype.softwareRemoved = function(softwareCube) {
	this.stackedsoftware = this.stackedsoftware.filter(item => item !== softwareCube);
}

exports.SoftwareCube.prototype.destroy = function() {
	//remove all stacked software as well
	var children =  this.stackedsoftware.slice();
	for (var i = 0; i < children.length; i++) {
		this.removeSoftware(children[i]);
	}

	this.parent.softwareRemoved(this);

	//remove the 2D overlay from seperate scene
	this.app.scene2D.remove(this.cssObject);

	//remove collision object from octree to get access to the details
	this.app.octree.remove(this.getCollisionMesh());
	this.app.octree.update();

	this.dispose();

	software = software.filter(item => item !== this.softwareCube);
	//rebuild global combined mesh
	this.rebuildGlobalMesh();
};

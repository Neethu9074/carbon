'use strict';

var THREE = require('three.js');
var sceneObj = require('./sceneObject');
var materials = require('./materials');
var geometries = require('./geometries');
var layouter = require('./layouter2DServer');

exports.BaseCube = function BaseCube(
  dataProvider, app, x, y, z, width, height, depth, id) {
  if (app === undefined || x === undefined ||
    y === undefined || z === undefined || width === undefined ||
    height === undefined || depth === undefined) {
    return undefined;
  }

  this.init(app, id, x, y ,z, width, height, depth);

  //the layouter for the softwareCubes
  this.layouter = new layouter.Layouter2DServer(width, depth);

  dataProvider.init(this);
  this.dataProvider = dataProvider;

  //create helper objects
  var collisionCube = this.createCollisionCube();
  this.setStatic(collisionCube);
  this.setCollisionMesh(collisionCube);

  //a collection where all connected cubes are stored
  this.connectedCubes = [];

  //a collection which stores all cubes inside this server cube
  this.containerChildren = [];
};

//inherence from SceneObject
exports.BaseCube.prototype = new sceneObj.SceneObject();
exports.BaseCube.prototype.constructor = exports.BaseCube;

exports.BaseCube.prototype.nextContainerPosition = function(width, depth) {
  try {
    //calculte next free field
    var xy = this.layouter.getNext(width, depth);
  } catch (err) {
    console.log(err);
    return undefined;
  }
  //get dimensions of the parent host
  var dim = this.dimension;
  var pos = this.position;

  //xy will be calculated in positive z coord so reverse it
  var pos = {
    x: xy.x + pos.x,
    y: pos.y,
    z: -xy.y + pos.z
  };

  return { xy: xy, pos: pos };
};

//this cube is used for collision / ray detection. In the app file,
//the collision objects are stored in a seperate collection to minimize
//collision cecking. the collision cube is a little bit bigger
//than the original cube.
exports.BaseCube.prototype.createCollisionCube = function() {
  var offset = new THREE.Vector3()
  .copy(this.dimension)
  .multiplyScalar(1.01); //1%

  var cube = new THREE.Mesh(
    geometries.cube,
    materials.collisionCubeMaterial);

  cube.scale.copy(offset);

  cube.position.copy(this.position);
  cube.position.x += this.dimension.x / 2;
  cube.position.y += this.dimension.y / 2;
  cube.position.z -= this.dimension.z / 2;

  //set name to identify later
  cube.name = name;
  return cube;
}

exports.BaseCube.prototype.connectWith = function(otherCube, connection) {
  this.connectedCubes.push( { to: otherCube, connection: connection } );
};

exports.BaseCube.prototype.removeConnection = function(otherCube) {
  //remove the connected cube from collection
	this.connectedCubes = this.connectedCubes.filter(item => item.to !== otherCube);
};

//is called from the children in this.containerChildren when its disposed
exports.BaseCube.prototype.containerRemoved = function(container) {
  this.containerChildren = this.containerChildren.filter(item => item !==
    container);

  //set the layouter free from the removed cube so the space can be used anymore
  this.layouter.setFree(container.name);
}

exports.BaseCube.prototype.disposeBaseCube = function() {
  //destroy children
  var children = this.containerChildren.slice();
  for (var i = 0; i < children.length; i++) {
    children[i].dispose();
  }

  //make a copy of the collection, because the original collection gets modified
  var conCubes = this.connectedCubes.slice();
  for (var i = 0; i < conCubes.length; i++) {
    var item = conCubes[i];
    this.removeConnection(item.to);
    item.to.removeConnection(this);

    //destroy the connection only once
    this.appRef.removeObject(item.connection);
    item.connection.dispose();
    delete item.connection;
  }

  this.disposeSceneObject();

  this.dataProvider.dispose();
	this.dataProvider = null;
	this.connectedCubes = null;
};

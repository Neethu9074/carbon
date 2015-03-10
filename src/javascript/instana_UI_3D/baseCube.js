'use strict';

var THREE = require('three.js');
var sceneObj = require('./sceneObject');
var materials = require('./materials');
var geometries = require('./geometries');

exports.BaseCube = function BaseCube(
  dataProvider, app, x, y, z, width, height, depth, id) {
  if (app === undefined || x === undefined ||
    y === undefined || z === undefined || width === undefined ||
    height === undefined || depth === undefined) {
    return undefined;
  }

  this.init(app, id, x, y ,z, width, height, depth);

  dataProvider.init(this);
  this.dataProvider = dataProvider;

  //create helper objects
  var collisionCube = this.createCollisionCube();
  this.setStatic(collisionCube);
  this.setCollisionMesh(collisionCube);

  //a collection where all connected cubes are stored
  this.connectedCubes = [];
};

//inherence from SceneObject
exports.BaseCube.prototype = new sceneObj.SceneObject();
exports.BaseCube.prototype.constructor = exports.BaseCube;

exports.BaseCube.prototype.collectMaterials = function() {
  var root = this.getMesh();
  var find = function(mats, object) {
    for (var i = 0; i < object.children.length; i++) {
      var item = object.children[i];
      if (item.material !== undefined) {
        mats.push(item.material);
      }
      find(mats, item);
    }
  };

  var materials = [ root.material ];
  find(materials, root);
  return materials;
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

exports.BaseCube.prototype.disposeBaseCube = function() {
  //make a copy of the collection, because the original collection gets modified
  var conCubes = this.connectedCubes.slice();

  for (var i = 0; i < conCubes.length; i++) {
    var item = conCubes[i];
    this.removeConnection(item.to);
    item.to.removeConnection(this);

    //destroy the connection only once
    item.connection.destroy();
    this.appRef.removeObject(item.connection);
    item.connection = undefined;
  }

  this.disposeSceneObject();

  this.dataProvider.dispose();
	delete this.dataProvider;
	delete this.connectedCubes;
};

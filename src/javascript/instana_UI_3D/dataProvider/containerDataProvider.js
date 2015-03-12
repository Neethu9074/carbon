'use strict';

var THREE = require('three.js');
var geometries = require('../geometries');
var materials = require('../materials');
var bc = require('../baseCube');


exports.ContainerDataProvider = function ContainerDataProvider() {};

exports.ContainerDataProvider.prototype.init = function (baseCube) {
  if(!(baseCube instanceof bc.BaseCube)) {
    return;
  }

  this.host = baseCube;
  this.position = baseCube.position;
  this.dimension = baseCube.dimension;

  this.visibleMesh = this.createVisibleMesh();
  this.content2D = this.createCSS3DTestStuff();
};

exports.ContainerDataProvider.prototype.createVisibleMesh = function () {
  var cube = new THREE.Mesh(geometries.cube, materials.cubeSimpleMaterial);

  cube.scale.copy(this.dimension);
  cube.position.copy(this.position);
  cube.position.x += this.dimension.x / 2;
  cube.position.y += this.dimension.y / 2;
  cube.position.z -= this.dimension.z / 2;

  return cube;
};

exports.ContainerDataProvider.prototype.createCSS3DTestStuff = function() {
  var dim = this.dimension;

  var number = document.createElement('div');
  number.className = 'containerCSS3DLayer';
  number.innerHTML = this.host.discription;
  var object = new THREE.CSS3DObject(number);
  object.scale.set(1 / 110, 1 / 100, 1);

  object.position.copy(this.position);
  object.position.y += dim.y / 2;
  object.position.x += dim.x / 2;
  object.position.z += 0.1;

  object.rotation.x = -45 * Math.PI / 180;

  //set static
  object.matrixAutoUpdate = false;
  object.updateMatrix();

  return object;
};

exports.ContainerDataProvider.prototype.dispose = function() {
  this.position = null;
  this.dimension = null;
  this.visibleMesh = null;
  this.content2D = null;
  this.host = null;
};

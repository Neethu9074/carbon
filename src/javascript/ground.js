'use strict';

var THREE = require('three.js');
var math = require('./math');
var sceneObj = require('./sceneObject');
var materials = require('./materials');
var textures = require('./textures');

require('./extensions/Mirror');

//var url = require('image!../images/floor.png');
//var config = require('./config');

exports.Ground = function Ground(app) {
  this.init();
  this.registerForUpdate();

  this.counter = 0;
  this.appReference = app;
  this.groundMirror = undefined;

  var group = new THREE.Object3D();
  group.add(createGrid(app));

  var geometry = new THREE.PlaneBufferGeometry(300, 300, 1, 1);
  //mirror
  this.groundMirror = createMirror(app);
  var mirrorMesh = new THREE.Mesh(geometry, this.groundMirror.material);
  mirrorMesh.add(this.groundMirror);
  mirrorMesh.rotation.x = -90 * math.DegToRad;
  mirrorMesh.position.set(100, -0.11, -100);
  group.add(mirrorMesh);

  this.setMesh(group);
};

function createGrid(app) {
  var x = 160,
    y = 160;
  var geometry = new THREE.PlaneBufferGeometry(x, y, 1, 1);

  var maxAnisotropy = app.mainRenderer.getMaxAnisotropy();
  var texture = textures.groundTexture;
  texture.anisotropy = maxAnisotropy;

  var material = materials.groundMaterial;
  material.map = texture;

  var plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = 90 * math.DegToRad;
  plane.doubleSided = true;
  plane.position.set(x / 2, -0.1, -y / 2);

  //position will not change, so set to static which gives a perfomance boost
  plane.matrixAutoUpdate = false;
  plane.updateMatrix();

  return plane;
}

function createMirror(app) {
  return new THREE.Mirror(app.mainRenderer, app.mainCamera, app.scene, {
    clipBias: 0.03,
    textureWidth: 1024,
    textureHeight: 1024,
    color: 0x777777
  });
}

//inherence from SceneObject
exports.Ground.prototype = new sceneObj.SceneObject();
exports.Ground.prototype.constructor = exports.Ground;

exports.Ground.prototype.update = function(app) {
  this.counter++;
  if (this.counter % 10 === 0) {
    this.groundMirror.render();
  }
};

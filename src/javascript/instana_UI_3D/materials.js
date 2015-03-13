'use strict';

var THREE = require('three.js');
var colors = require('./colors');
var textures = require('./textures');


exports.cloudMaterialLight = new THREE.MeshBasicMaterial({
  color: 0xFFFFFF,
  transparent: true,
  depthWrite: false,
  opacity: 0.1,
  map: textures.cloudTextures[2]
});

exports.cloudMaterialMid = new THREE.MeshBasicMaterial({
  color: 0xFFFFFF,
  transparent: true,
  depthWrite: false,
  opacity: 0.4,
  map: textures.cloudTextures[1]
});

exports.cloudMaterialHeavy = new THREE.MeshBasicMaterial({
  color: 0xFFFFFF,
  transparent: true,
  depthWrite: false,
  opacity: 0.4,
  map: textures.cloudTextures[0]
});

exports.groundMaterial = new THREE.MeshBasicMaterial({
  color: 0xFFFFFF,
  side: THREE.DoubleSide,
  transparent: true,
  depthWrite: false,
  opacity: 1
});

exports.lineMaterial = new THREE.LineBasicMaterial({
  color: colors.lightBlue
});

exports.collisionCubeMaterial = new THREE.MeshBasicMaterial({
  color: colors.lightBlue
});

exports.cubeDetailedMaterial = new THREE.MeshPhongMaterial({
  color: colors.midBlue,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 1,
  blending: THREE.NormalBlending,
  map: textures.serverCubeTexture,
  shininess: 5
});

exports.cubeSimpleMaterial = new THREE.MeshLambertMaterial({
	color: colors.lightBlue,
	map: textures.softwareCubeTexture
});

exports.stateSymbolWarningMaterial = new THREE.MeshLambertMaterial({
	color: 0xfff41f,
	transparent: true
});

exports.stateSymbolErrorMaterial = new THREE.MeshLambertMaterial({
	color: 0xff1f35,
	transparent: true
});

exports.highlightMaterial = new THREE.MeshBasicMaterial( {
  color: colors.lightBlue,
  transparent: true,
  opacity: 0.5,
  map: textures.highlightTexture
});

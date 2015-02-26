'use strict';

var THREE = require('three.js');
var colors = require('./colors');
var textures = require('./textures');

exports.groundMaterial = new THREE.MeshBasicMaterial({
  color: 0xFFFFFF,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 1
});

exports.lineMaterial = new THREE.LineBasicMaterial({
  color: colors.lightBlue
});

exports.cubeDetailedMaterial = new THREE.MeshLambertMaterial({
  color: colors.midBlue,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 1,
  blending: THREE.NormalBlending,
  map: textures.serverCubeTexture
});

exports.cubeSimpleMaterial = new THREE.MeshLambertMaterial({
	color: colors.lightBlue,
	map: textures.softwareCubeTexture
});

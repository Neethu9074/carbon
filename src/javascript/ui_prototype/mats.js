'use strict';

var THREE = require('three.js');
var colors = require('./colors');
var textures = require('./textures');


exports.groundMaterial = new THREE.MeshBasicMaterial({
  color: colors.groundColor,
  side: THREE.DoubleSide,
	map: textures.groundTexture,
  transparent: true,
  depthWrite: false,
  opacity: 1
});

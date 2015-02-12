'use strict';

var THREE = require('three.js');
var colors = require('./colors');

exports.groundMaterial = new THREE.MeshBasicMaterial({
	color: colors.darkBlue,
	side: THREE.DoubleSide
});

exports.cubeMaterialTransparent = new THREE.MeshLambertMaterial({
	color: colors.midBlue,
	depthWrite: false,
	transparent: true,
	opacity: 0.8,
	side: THREE.DoubleSide,
	combine: THREE.MixOperation
});

exports.cubeMaterialOpaque = new THREE.MeshLambertMaterial({
	color: colors.midBlue
});

exports.markerMaterial = new THREE.MeshBasicMaterial({
	color: colors.lightBlue
});


exports.lineMaterial = new THREE.LineBasicMaterial({
  color: colors.lightBlue,
  side: THREE.DoubleSide
});

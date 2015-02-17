'use strict';

var THREE = require('three.js');
var colors = require('./colors');

exports.groundMaterial = new THREE.MeshBasicMaterial({
	color: colors.lightBlue,
	side: THREE.DoubleSide,
	transparent: true,
	opacity: 0.5
});

exports.markerMaterial = new THREE.MeshBasicMaterial({
	color: colors.lightBlue
});

exports.lineMaterial = new THREE.LineBasicMaterial({
  color: colors.lightBlue
});

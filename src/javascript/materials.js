'use strict';

var THREE = require('three.js');
var colors = require('./colors');

exports.groundmaterial = new THREE.MeshBasicMaterial({
	color: colors.darkBlue,
	side: THREE.DoubleSide
});

exports.cubematerial = createCubeMaterial(colors.midBlue);

function createCubeMaterial(cubeColor) {
	return new THREE.MeshLambertMaterial({
		color: cubeColor
	});
	/*return new THREE.MeshLambertMaterial({
		color: cubeColor,
		depthWrite: false,
		transparent: true,
		opacity: 0.8,
		side: THREE.DoubleSide,
		combine: THREE.MixOperation
	});*/
}

exports.lineMaterial = new THREE.LineBasicMaterial({
    color: colors.lightBlue,
    side: THREE.DoubleSide
  });

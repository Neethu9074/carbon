'use strict';

var THREE = require('three.js');
require('./extensions/OBJLoader');
var math = require('./math');

exports.warningSymbol = function() {
	var container = new THREE.Object3D();
	var loader = new THREE.OBJLoader();
	var material = new THREE.MeshLambertMaterial({
		color: 0xFFFF00,
		transparent: true,
    visible: false
	});

	loader.load(
		'obj/warning.obj', //resource URL
		function(object) { // Function when resource is loaded
			object = object.children[0];
			object.material = material;
			object.rotation.x = 90 * math.DegToRad;
			container.add(object);
		}
	);
	return container;
};

exports.errorSymbol = function() {
	var container = new THREE.Object3D();
	var loader = new THREE.OBJLoader();
	var material = new THREE.MeshLambertMaterial({
		color: 0xFF0000,
		transparent: true,
    visible: false
	});

	loader.load(
		'obj/error.obj', //resource URL
		function(object) { // Function when resource is loaded
			object = object.children[0];
			object.material = material;
			object.rotation.x = 90 * math.DegToRad;
			container.add(object);
		}
	);
	return container;
};

'use strict';

var THREE = require('three.js');
var colors = require('./colors');

module.exports = function Connection(app, fromV, toV) {

	var material = new THREE.LineBasicMaterial({
		color: colors.connectionColor,
		side: THREE.DoubleSide
	});

	var fromPos = new THREE.Vector3(fromV.x + 0.5, 0.25, fromV.y - 0.5);
	var toPos = new THREE.Vector3(toV.x + 0.5, 0.25, toV.y - 0.5);

	var actualpoints = [fromPos, toPos];

	var actualextrudePath = new THREE.SplineCurve3(actualpoints);
	var actualtube = new THREE.TubeGeometry(
		actualextrudePath, //path
		1, //segments
		0.02, //radius
		4, //radius segments
		false, false);

	var actualtubeMesh = new THREE.Mesh(actualtube, material);
	app.scene.add(actualtubeMesh);
};

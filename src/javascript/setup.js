'use strict';

var THREE = require('three.js');
var ground = require('./ground');
var cube = require('./cube');
var connection = require('./connection');

module.exports = function createTestSetup(app) {
  ground(app);
	cube(app.scene, 0, 0, 1, 1, 0.5);
	cube(app.scene, 0, 1, 1, 1, 0.5);
	cube(app.scene, 2, 0, 1, 2, 0.5);
	cube(app.scene, -2, 2, 3, 2, 0.5);
	cube(app.scene, 1, -1, 1, 1, 0.2);

  connection(app, new THREE.Vector2(0, 0), new THREE.Vector2(0, -1));

//	new instana.Plane(app, -1, -1, 4, 2, Colors.normalPlaneColor)
};

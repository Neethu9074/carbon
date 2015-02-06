'use strict';

var ground = require('./ground');
var cube = require('./cube');
var connection = require('./connection');

module.exports = function createTestSetup(app) {
	//add the ground
  app.addObject(new ground.Ground(app));

	//add a few cubes
	app.addObject(new cube.Cube(0, 0, 1, 1, 0.5));
  app.addObject(new cube.Cube(0, 0, 1, 1, 0.5));
  app.addObject(new cube.Cube(0, 1, 1, 1, 0.5));
  app.addObject(new cube.Cube(2, 0, 1, 2, 0.5));
  app.addObject(new cube.Cube(-2, 2, 3, 2, 0.5));
  app.addObject(new cube.Cube(1, -1, 1, 1, 0.2));

	//add connections
  app.addObject(new connection.Connection(0, 0, 0, -1));

  //	new instana.Plane(app, -1, -1, 4, 2, Colors.normalPlaneColor)
};

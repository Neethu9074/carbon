'use strict';

var cube = require('./cube');
var connection = require('./connection');

module.exports = function createTestSetup(app) {
	var gc = app.groundControl;
	var xy;
	//add a few cubes
	for (var i = 0; i < 30; i++) {
		var x = Math.floor(Math.random() * 3) + 1;
		var y = Math.floor(Math.random() * 3) + 1;
		xy = gc.getNearestFreeField(x, y);
		app.addObject(new cube.Cube(xy.x, xy.y, x, y, 0.2));
	}

	//add connections
	app.addObject(new connection.Connection(0, 0, 2, 0));

	//	new instana.Plane(app, -1, -1, 4, 2, Colors.normalPlaneColor)
};

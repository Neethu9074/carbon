'use strict';

var cube = require('./cube');
var connection = require('./connection');

module.exports = function createTestSetup(app) {
	var gc = app.groundControl;
	var xy;

	//add a few cubes
	var cubes = [];
	for (var i = 0; i < 25; i++) {
		//create random cubes with a random width and depth
		var randomScale = Math.ceil(Math.random() * 2);
		xy = gc.getNearestFreeField(10 * randomScale);
		if (xy !== undefined) {
			var newCube = new cube.Cube(app, xy.x, xy.y, randomScale);
			cubes.push(newCube);
			app.addObject(newCube);
		}
	}

  i = 0;
	do {
		var a = cubes[i];
		var b = cubes[++i];
		if (a === undefined || b === undefined) {
			break;
		}
		var path = gc.getPath({
      x: a.x,	y: a.y,	width: a.width,	height: a.height
		}, {
			x: b.x,	y: b.y,	width: b.width,	height: b.height
		});
		if (path !== undefined) {
			var con = new connection.Connection(path);
			app.addObject(con);
		}
	} while (b !== undefined);
};

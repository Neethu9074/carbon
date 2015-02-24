'use strict';

var server = require('./serverCube');
var connection = require('./connection');

module.exports = function createTestSetup(app) {
	//test
	var width = Math.ceil(Math.random() * 2);
	var cube = new server.ServerCube(app, -3, 1, width, width);
	app.addObject(cube);

	for (var i = 0; i < 12; i++) {
		cube.addSoftware(app, {});
	}
	//test end

	var layouter = app.layouter;
	var xy;
	//add a few cubes
	var cubes = [];
	for (var i = 0; i < 2; i++) {
		//create random cubes with a random width and depth
		var w = Math.ceil(Math.random() * 2);
		var h = w;

		try{
			xy = layouter.getNext(w, h);
		} catch(err) {
			console.log(err);
			break;
		}

		if (xy !== undefined) {
			var newCube = new server.ServerCube(app, xy.x, xy.y, w, h);
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
		var path = layouter.getPath({
			x: a.x,
			y: a.y,
			width: a.width,
			height: a.height
		}, {
			x: b.x,
			y: b.y,
			width: b.width,
			height: b.height
		});
		if (path !== undefined) {
			var con = new connection.Connection(path);
			app.addObject(con);
		}
	} while (b !== undefined);
};

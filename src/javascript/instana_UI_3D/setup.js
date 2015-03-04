'use strict';

var server = require('./serverCube');
var connection = require('./connection');

module.exports = function createTestSetup(app) {
	//test
	var cube = new server.ServerCube(app, -1, -1, 1, 1);
	app.addObject(cube);

	for (var i = 0; i < 4; i++) {
		cube.addSoftware(app, {});
	}

	var newOne = cube.addSoftware(app, { id: 'Apache 2.4' });
	newOne = newOne.addSoftware({ id: 'JVM' });
	newOne = newOne.addSoftware({ id: 'namegame' });

	//test end
	//---------------------------------------------------------------------

	var layouter = app.layouter;
	var xy;
	//add a few cubes
	var cubes = [];
	for (i = 0; i < 3; i++) {
		//create random cubes with a random width and depth
		var w = Math.ceil(Math.random() * 2);
		var h = w;

		try{
			xy = layouter.getNext(w, h);
		} catch(err) {
			break;
		}

		if (xy !== undefined) {
			var newCube = new server.ServerCube(
				app, xy.x, xy.y, w, h);
			cubes.push(newCube);
			app.addObject(newCube);

			//say the layouter, that the area should be blocked
			layouter.setBlocked(xy, w, h, newCube.name);
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
			width: a.dimension.width,
			depth: a.dimension.depth
		}, {
			x: b.x,
			y: b.y,
			width: b.dimension.width,
			depth: b.dimension.depth
		});
		if (path !== undefined) {
			var con = new connection.Connection(app, path);
			app.addObject(con);
			a.connectWith(b, con);
			b.connectWith(a, con);
		}
	} while (b !== undefined);
};

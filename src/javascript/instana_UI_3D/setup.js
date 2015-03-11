'use strict';

var connection = require('./connection');

module.exports = function createTestSetup(app) {
	//test
	var cube = app.addHost(1, 1);
	for (var i = 0; i < 4; i++) {
		cube.addContainer({id: 'unbekannt'});
	}

	var newOne = cube.addContainer({ id: 'JVM' });
	newOne = newOne.stackContainer({ id: 'Java Host' });
	newOne = newOne.stackContainer({ id: 'namegame' });
	//test end
	//---------------------------------------------------------------------

	//add a few cubes
	var cubes = [];
	for (i = 0; i < 4; i++) {
		//create random cubes with a random width and depth
		var w = Math.ceil(Math.random() * 2);
		var newCube = app.addHost(w, w);
		cubes.push(newCube);
	}

	i = 0;
	do {
		var a = cubes[i];
		var b = cubes[++i];
		if (a === undefined || b === undefined) {
			break;
		}

		var path = app.layouter.getPath(a, b);
		if (path !== undefined) {
			var con = new connection.Connection(a, b, path);
			app.addObject(con);
		}
	} while (b !== undefined);
};

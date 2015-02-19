'use strict';

var cube = require('./baseCube');

exports.SoftwareCube = function SoftwareCube(app, x, y, scaleFactor) {
	if (app === undefined ||
    x === undefined ||
    y === undefined ||
    scaleFactor ===	undefined) {
		return;
	}

	cube.Cube.call(this, app, x, y, scaleFactor);
};

//inherence from SceneObject
exports.SoftwareCube.prototype = new cube.Cube();
exports.SoftwareCube.prototype.constructor = exports.SoftwareCube;

'use strict';

var baseCube = require('./baseCube');

exports.SoftwareCube = function SoftwareCube(app, serverCube) {
  if (app === undefined ||
    serverCube === undefined) {
    return undefined;
  }

	var dimension = serverCube.dimension;
	var x = dimension.x - (dimension.width / 2.0) + 1;
	var y = dimension.z + (dimension.depth / 2.0) + 1;
  baseCube.BaseCube.call(this, app, x, y, 3, 1, 3);

	var mats = this.collectMaterials();
	for (var i = 0; i < mats.length; i++) {
		mats[i].transparent = false;
	}
};

//inherence from SceneObject
exports.SoftwareCube.prototype = new baseCube.BaseCube();
exports.SoftwareCube.prototype.constructor = exports.SoftwareCube;

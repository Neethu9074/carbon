'use strict';

var baseCube = require('./baseCube');

exports.SoftwareCube = function SoftwareCube(app, xy) {
  if (app === undefined || xy === undefined) {
    return undefined;
  }

  baseCube.BaseCube.call(this, app, xy.x, -xy.y, 2, 0.25, 2);

	var mats = this.collectMaterials();
	for (var i = 0; i < mats.length; i++) {
		mats[i].transparent = false;
	}
};

//inherence from SceneObject
exports.SoftwareCube.prototype = new baseCube.BaseCube();
exports.SoftwareCube.prototype.constructor = exports.SoftwareCube;

'use strict';

var THREE = require('three.js');

var gridImagePath = require('../../images/grid.png');


//the repeated texture for the ground
exports.groundTexture = ( function() {
	var texture = THREE.ImageUtils.loadTexture('bundle/' + gridImagePath);
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(50, 50);
	texture.antisotropy = 16;
	return texture;
})();

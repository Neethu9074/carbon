'use strict';

var THREE = require('three.js');
var colors = require('./colors');
var math = require('./math');

module.exports = function Ground(app) {
	var x = 10000,
		y = 10000;
	var geometry = new THREE.PlaneBufferGeometry(x, y, 1, 1);
/*	var maxAnisotropy = app.renderer.getMaxAnisotropy();

	var texture = THREE.ImageUtils.loadTexture('img/floor.png');
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(x, y);
	texture.anisotropy = maxAnisotropy;
*/

	var material = new THREE.MeshBasicMaterial({
		color: colors.groundColor,
		side: THREE.DoubleSide,
		//transparent: true
		//map: texture
	});

	var plane = new THREE.Mesh(geometry, material);
	plane.rotation.x = 90 * math.DegToRad;
	plane.doubleSided = true;
	plane.position.set(0, -0.001, 0);
	app.scene.add(plane);
};

'use strict';

var THREE = require('three.js');
require('./extensions/OBJLoader');
var obj = require('./obj');

var warningObjectPath = require('../../obj/warning.obj');
var errorObjectPath = require('../../obj/error.obj');
var cubeObjectPath = require('../../obj/cube.obj');

exports.load = function(onFinished) {
	loadModel('bundle/' + warningObjectPath, obj.setStateWarningSymbol,
		function() {
			loadModel('bundle/' + errorObjectPath, obj.setStateErrorSymbol,
				function() {
					loadModel('bundle/' + cubeObjectPath, obj.setCube,
						function() {
							onFinished();
						});
				});
		});
};

function loadModel(model, set, onFinished) {
	var loader = new THREE.OBJLoader();
	loader.load(
		model,
		function(object) {
			object = object.children[0];
			set(object);
			onFinished();
		}
	);
}

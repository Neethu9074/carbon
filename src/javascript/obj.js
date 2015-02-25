'use strict';

var THREE = require('three.js');

exports.stateWarningSymbol = undefined;
exports.setStateWarningSymbol = function(object){
	exports.stateWarningSymbol = object;
};

exports.stateErrorSymbol = undefined;
exports.setStateErrorSymbol = function(object){
	exports.stateErrorSymbol = object;
};

exports.stateSymbolMaterial = function(color){
	return new THREE.MeshLambertMaterial({
		color: color,
		transparent: true,
		visible: false
	});
};

exports.cube = undefined;
exports.setCube = function(object){
	exports.cube = object;
};

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

exports.cube = undefined;
exports.setCube = function(object){
	exports.cube = object;
};

'use strict';

var THREE = require('three.js');
require('./extensions/OBJLoader');
var obj = require('./obj');

exports.load = function(onFinished) {
  loadModel('obj/warning.obj', obj.setStateWarningSymbol, function(){
  loadModel('obj/error.obj', obj.setStateErrorSymbol, function(){
  loadModel('obj/cube.obj', obj.setCube, function(){
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

'use strict';

var THREE = require('three.js');
var sceneObj = require('./sceneObject');
var materials = require('./materials');

exports.Marker = function Marker(from, to) {

	var material = materials.markerMaterial;
  var geometry = new THREE.CylinderGeometry( 0.01, 0.1, 5, 4, 1, false );
  var cylinder = new THREE.Mesh( geometry, material );

  cylinder.position.set(from, 1, -to);

	this.setMesh(cylinder);
};

//inherence from SceneObject
exports.Marker.prototype = new sceneObj.SceneObject();
exports.Marker.prototype.constructor = exports.Marker;

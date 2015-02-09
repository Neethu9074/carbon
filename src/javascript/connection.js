'use strict';

var THREE = require('three.js');
var colors = require('./colors');
var sceneObj = require('./sceneObject');

exports.Connection = function Connection(fromX, fromY, toX, toY) {
  this.init();

  //calculate new positions
  var fromPos = new THREE.Vector3(fromX + 0.5, 0.1, fromY - 0.5);
  var toPos = new THREE.Vector3(toX + 0.5, 0.1, toY - 0.5);

  var mesh = createMesh(fromPos, toPos);

  this.setMesh(mesh);
};

//inherence from SceneObject
exports.Connection.prototype = new sceneObj.SceneObject();
exports.Connection.prototype.constructor = exports.Connection;

function createMesh(fromPos, toPos) {
  var material = new THREE.LineBasicMaterial({
    color: colors.connectionColor,
    side: THREE.DoubleSide
  });

  var actualpoints = [fromPos, toPos];

  var actualextrudePath = new THREE.SplineCurve3(actualpoints);
  var actualtube = new THREE.TubeGeometry(
    actualextrudePath, //path
    1, //segments
    0.02, //radius
    4, //radius segments
    false, false);

  return new THREE.Mesh(actualtube, material);
}

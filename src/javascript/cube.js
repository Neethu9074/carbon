'use strict';

var THREE = require('three.js');
var colors = require('./colors');

module.exports = function Cube(scene, x, y, width, depth, height) {
  var materials = [
    createMaterial(colors.cubeGreenMidColor), //right
    createMaterial(colors.cubeGreenMidColor), //left
    createMaterial(colors.cubeGreenDarkColor), //top
    createMaterial(colors.cubeGreenDarkColor), //bottom
    createMaterial(colors.cubeGreenLightColor), //front
    createMaterial(colors.cubeGreenLightColor) //back
  ];
  var cube = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshFaceMaterial(materials));

  var xMiddle = (width / 2) + x;
  var zMiddle = (-depth / 2) - y;
  var yMiddle = height / 2;
  cube.position.set(xMiddle, yMiddle, zMiddle);

  scene.add(cube);

  //add a sphere in the middle
  var sphereMaterial = new THREE.MeshBasicMaterial({
    color: colors.connectionColor
  });

  var sphere = new THREE.Mesh(new THREE.SphereGeometry(0.05), sphereMaterial);
  sphere.position.set(xMiddle, yMiddle, zMiddle);
  scene.add(sphere);
};

function createMaterial(cubeColor) {
  return new THREE.MeshBasicMaterial({
    color: cubeColor,
    depthWrite: false,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
    combine: THREE.MixOperation
  });
}

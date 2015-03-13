'use strict';

var THREE = require('three.js');
var math = require('../math');
var geometries = require('../geometries');
var bc = require('../baseCube');
var host = require('../hostCube');
var obj = require('../obj');
var globalMats = require('../materials');

var okImagePath = require('../../../images/Ok.png');
var warningImagePath = require('../../../images/Warning.png');
var errorImagePath = require('../../../images/Error.png');

var hostImagePath = require('../../../images/icon_host.png');
var systemImagePath = require('../../../images/icon_system.png');


exports.HostDataProvider = function HostDataProvider() {};

exports.HostDataProvider.prototype.init = function(baseCube) {
  if (!(baseCube instanceof bc.BaseCube)) {
    return;
  }

  this.host = baseCube;
  this.position = baseCube.position;
  this.dimension = baseCube.dimension;

  this.visibleMesh = this.createVisibleMesh();
  this.content2D = this.createCSS3DTestStuff();

  //the state symbols
  var symbolPos = this.position.clone();
  symbolPos.y += this.dimension.y + 3;
  symbolPos.x += this.dimension.x / 2;
  symbolPos.z -= 6;

  this.stateWarningSymbol = new THREE.Mesh(
    obj.stateWarningSymbol.geometry,
    globalMats.stateSymbolWarningMaterial);
  this.stateWarningSymbol.position.copy(symbolPos);
  this.stateWarningSymbol.scale.multiplyScalar(3);

  this.stateErrorSymbol = new THREE.Mesh(
    obj.stateErrorSymbol.geometry,
    globalMats.stateSymbolErrorMaterial);
  this.stateErrorSymbol.position.copy(symbolPos);
  this.stateErrorSymbol.scale.multiplyScalar(3);
};

exports.HostDataProvider.prototype.createVisibleMesh = function() {
  var cube = new THREE.Mesh(geometries.cube);

  cube.scale.copy(this.dimension);
  cube.position.copy(this.position);
  cube.position.x += this.dimension.x / 2;
  cube.position.y += this.dimension.y / 2;
  cube.position.z -= this.dimension.z / 2;

  return cube;
};

exports.HostDataProvider.prototype.createCSS3DTestStuff = function() {
  var content = this.toHTML();
  var pos = new THREE.Vector3().copy(this.position);
  var dim = this.dimension;
  pos.y += (dim.y / 2);

  var number = document.createElement('div');
  number.className = 'hostCSS3DLayer';
  number.innerHTML = content;

  var object = new THREE.CSS3DObject(number);

  //400px in css are 1 unit in 3D space so 1*width / 400
  object.scale.set(dim.x / 800, dim.z / 800, 1);

  object.position.copy(pos);
  object.position.x += dim.x / 2;
  object.position.y += dim.y / 2;
  object.position.z -= dim.z / 2;

  object.rotation.x = -90 * math.DegToRad;
  //set static
  object.matrixAutoUpdate = false;
  object.updateMatrix();

  return object;
};

exports.HostDataProvider.prototype.toHTML = function() {
  var h = this.host;

  var id = h.name;
  var cpu = h.cpu;
  var memory = h.memory;
  var os = h.operatingSystem;

  var html = '<h4></h4><p><img src= bundle/' + hostImagePath +
    ' class=icon>Host</p>' +
    '<ul><li>' + id + '</li></ul>' +
    '<h4></h4><p><img src= bundle/' + systemImagePath +
      ' class=icon>System</p>' +
    '<ul><li>' + os + '</li>' +
    '<li>' + cpu + '</li>' +
    '<li>' + memory + '</li></ul>';

	return html;
};

exports.HostDataProvider.prototype.setState = function(newState) {
  var ele = this.content2D.element;
  var container = host.globalMeshObjectForServerContainer;

  if (newState === host.STATE.OK) {
    //ele.innerHTML = '<img src="bundle/' + okImagePath + '">';
    container.remove(this.stateWarningSymbol);
    container.remove(this.stateErrorSymbol);

  } else if (newState === host.STATE.WARNING) {
    //ele.innerHTML = '<img src="bundle/' + warningImagePath + '">';
    container.add(this.stateWarningSymbol);
    container.remove(this.stateErrorSymbol);

  } else {
    //ele.innerHTML = '<img src="bundle/' + errorImagePath + '">';
    container.remove(this.stateWarningSymbol);
    container.add(this.stateErrorSymbol);
  }
};

exports.HostDataProvider.prototype.update = function() {
  var dt = this.host.appRef.deltaTime;
  var t = this.host.appRef.timeSinceStarted;

  this.stateWarningSymbol.rotation.y -= dt;
  this.stateErrorSymbol.rotation.y -= dt;
  this.stateWarningSymbol.position.y = 6 + Math.sin(t * 4) * 0.5;
  this.stateErrorSymbol.position.y = 6 + Math.sin(t * 4) * 0.5;
};

exports.HostDataProvider.prototype.dispose = function() {
  this.position = null;
  this.dimension = null;
  this.visibleMesh = null;
  this.content2D = null;
  this.host = null;

  var container = host.globalMeshObjectForServerContainer;
  container.remove(this.stateWarningSymbol);
  container.remove(this.stateErrorSymbol);

  this.stateWarningSymbol.geometry.dispose();
  this.stateErrorSymbol.geometry.dispose();
};

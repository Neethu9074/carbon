'use strict';

var THREE = require('three.js');
var math = require('./math');
var baseCube = require('./baseCube');
//var colors = require('./colors');
//var textTexture = require('./extensions/textTextureFacade');

exports.SoftwareCube = function SoftwareCube(app, xy) {
  if (app === undefined || xy === undefined) {
    return undefined;
  }

	this.app = app;
  baseCube.BaseCube.call(this, app, xy.x, xy.y, 2, 0.5, 2, false);

	this.cssObject = createCSS3DTestStuff(app, this.dimension, 'Apache 2.4');
	this.hide();
};

//inherence from SceneObject
exports.SoftwareCube.prototype = new baseCube.BaseCube();
exports.SoftwareCube.prototype.constructor = exports.SoftwareCube;

exports.SoftwareCube.prototype.hide = function(){
	this.app.scene2D.remove(this.cssObject);
};

exports.SoftwareCube.prototype.show = function(){
	this.app.scene2D.add(this.cssObject);
};

function createCSS3DTestStuff(app, dimension, name) {
	var content = name;
	var pos = new THREE.Vector3(dimension.x, dimension.y * 2, dimension.z);
	pos.z += dimension.depth / 2;
	var scaleX = dimension.width / 3;
	var scaleY = dimension.depth / 3;

	var number = document.createElement('div');
	number.className = 'softwareCSS3DLayer';
	number.innerHTML = content;
	var object = new THREE.CSS3DObject(number);
	object.scale.set(scaleX / 40, scaleY / 40, 1);
	object.position.copy(pos);
	object.rotation.x = -90 * math.DegToRad;

	return object;
}

/* obsolet
function createLabel(dimension, name) {
  var width = dimension.width,
    height = dimension.height;

  //width -= 0.01;
  var labelHeight = 0.5;
  var aspect = width * 2;
  var topOfCube = height + 0.01; // 0.01 to avoid z-fighting

  //get a texture from the facade
  var tex = textTexture.createTexture(name, aspect);
  //set to linear because the texture is not power of 2 (64x64, 32x32, ...)
  tex.minFilter = THREE.LinearFilter;

  var labelMat = new THREE.MeshBasicMaterial({
    map: tex
	});

  var geometry = new THREE.PlaneBufferGeometry(width, labelHeight, 1, 1);
  var plane = new THREE.Mesh(geometry, labelMat);
  plane.position.set(dimension.x, topOfCube, dimension.z);
  plane.rotateOnAxis(new THREE.Vector3(1, 0, 0), -90 * math.DegToRad);

	//set static
  plane.matrixAutoUpdate = false;
  plane.updateMatrix();

  //set name to identify later
  plane.name = name;
  return plane;
}
*/

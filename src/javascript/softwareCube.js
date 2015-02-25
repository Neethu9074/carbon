'use strict';

var THREE = require('three.js');
var math = require('./math');
var baseCube = require('./baseCube');
var software = require('./softwareCube');
//var colors = require('./colors');
//var textTexture = require('./extensions/textTextureFacade');

exports.SoftwareCube = function SoftwareCube(serverCube, app, xyz) {
	if (app === undefined || xyz === undefined) {
		return undefined;
	}

	baseCube.BaseCube.call(this, app, xyz.x, xyz.y, xyz.z, 2, 0.4, 2, false);

	//the parent server or software, where the software belongs to
	this.parent = serverCube

	this.app = app;

	//in this collection higher level softwareCubes will be stored
	this.stackedsoftware = [];

	this.cssObject = createCSS3DTestStuff(app, this.dimension, 'Apache 2.4');
	this.hide();
};

//inherence from SceneObject
exports.SoftwareCube.prototype = new baseCube.BaseCube();
exports.SoftwareCube.prototype.constructor = exports.SoftwareCube;

exports.SoftwareCube.prototype.hide = function() {
	//remove the 2D overlay from seperate scene
	this.app.scene2D.remove(this.cssObject);

	//remove all stacked software as well
	for (var i = 0; i < this.stackedsoftware.length; i++) {
		this.stackedsoftware[i].hide();
		this.app.removeObject(this.stackedsoftware[i]);
	}
};

exports.SoftwareCube.prototype.show = function() {
	//add the 2D overlay from seperate scene
	this.app.scene2D.add(this.cssObject);

	//add all stacked software as well
	for (var i = 0; i < this.stackedsoftware.length; i++) {
		this.stackedsoftware[i].show();
		this.app.addObject(this.stackedsoftware[i]);
	}
};

function createCSS3DTestStuff(app, dimension, name) {
	var content = name;
	var pos = new THREE.Vector3(
		dimension.x,
		dimension.y + dimension.height / 2,
		dimension.z);

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

	//set static
	object.matrixAutoUpdate = false;
	object.updateMatrix();

	return object;
}

exports.SoftwareCube.prototype.addSoftware = function(app, options) {
	//get dimensions of the parent server
	var dim = this.dimension;

	var xyz = {
		x: 0,
		y: dim.y + dim.height / 2,
		z: 0.5
	};
	xyz.x += dim.x - (dim.width / 2);
	xyz.z -= dim.z + (dim.depth / 2);

	//create the cube
	var swCube = new software.SoftwareCube(this, app, xyz);
	this.stackedsoftware.push(swCube);

	console.log('software stacked onto software: ', swCube);
	return swCube;
};

exports.SoftwareCube.prototype.removeSoftware = function(softwareCube) {
	this.stackedsoftware.pop();
	this.app.removeObject(softwareCube);
};



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

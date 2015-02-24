'use strict';

var THREE = require('three.js');
var math = require('./math');
var baseCube = require('./baseCube');
var software = require('./softwareCube');
var layouter = require('./layouter2DServer');
require('./extensions/OBJLoader');

var DIRECTION = {
	IN: {
		id: 1
	},
	OUT: {
		id: 2
	}
};

var STATE = {
	OK: {
		id: 1,
		objPath: 'obj/ok.obj',
		color: 0x00FF00,
		htmlContent: '<img src="images/Ok.png">'
	},
	WARNING: {
		id: 2,
		objPath: 'obj/warning.obj',
		color: 0xFFFF00,
		htmlContent: '<img src="images/Warning.png">'
	},
	ERROR: {
		id: 3,
		objPath: 'obj/error.obj',
		color: 0xFF0000,
		htmlContent: '<img src="images/Error.png">'
	}
};

exports.ServerCube = function ServerCube(app, x, y, w, h) {
	if (app === undefined || x === undefined ||
		y === undefined || w === undefined || h === undefined) {
		return undefined;
	}
	var scaleFactor = 16;

	x *= scaleFactor;
	y *= scaleFactor;
	x += 2;
	y += 2;
	var width = scaleFactor * w - 6;
	var height = 3;
	var depth = scaleFactor * h - 6;
	baseCube.BaseCube.call(this, app, x, y, width, height, depth, true);

	//set state
	//TODO: not random :)
	var r = Math.ceil(Math.random() * 3);
	if (r === 1) {
		this.state = STATE.OK;
	} else if (r === 2) {
		this.state = STATE.WARNING;
	} else {
		this.state = STATE.ERROR;
	}

	this.layouter = new layouter.Layouter2DServer(width, depth);
  this.gridIndex = 0;
	this.grid = createGrid(width, depth);
	//a collection which stores all cubes inside this server cube
	this.children = [];

	//this collection stores all special server materials, to be animated
	this.additionalOpacityAnimatedMaterials = [];

	//create the 3D rotating symbol
	this.stateSymbol = new THREE.Object3D();
	this.createStateSymbol();

	//register for update to calculate distance and fading
	this.registerForUpdate();

	//tween parameters
	this.minDistanceForTransparency = 25; // 16.5;
	this.tweenDirection = DIRECTION.OUT;

	//stores all materials, that are animated due to animation process
	this.opacityAnimatedMaterials = this.collectMaterials();

	this.details = getDetailsGroup(this.dimension);
	this.setStatic(this.details);

	//save the css stuff
	this.cssObject = createCSS3DTestStuff(this.state, app, this.dimension);
	this.setTransparency(app, {
		v: 0
	}, {
		v: 1
	}, 0);
	this.hideDetails(app, this);
};

//inherence from SceneObject
exports.ServerCube.prototype = new baseCube.BaseCube();
exports.ServerCube.prototype.constructor = exports.ServerCube;

function createGrid(width, height){
	var gridTemp = [];

	var x = 0;
	var y = 0;
	var stepX = 3;
	var stepY = 3;
	while(y <= height - 2) {
		gridTemp.push({ x: x, y: y });
		x += stepX;
		if(x >= width - 2){
			x = 0;
			y += stepY;
		}
	}
	return gridTemp;
}

exports.ServerCube.prototype.createStateSymbol = function() {
	var dim = this.dimension;
	var group = this.getMesh();
	var symbol = this.stateSymbol;
	var state = this.state;
	var material = new THREE.MeshBasicMaterial({
		color: state.color,
		transparent: true
	});
	this.additionalOpacityAnimatedMaterials.push(material);

	var loader = new THREE.OBJLoader();
	// load a resource
	loader.load(
		// resource URL
		state.objPath,
		// Function when resource is loaded
		function(object) {
			object = object.children[0];
			object.position.set(dim.x, 5, dim.z - (dim.depth / 3));
			object.material = material;
			object.rotation.x = 90 * math.DegToRad;
			object.scale.set(1, 1, 1);

			//save for later use
			symbol.children.push(object);

			//set name to identify later
			object.name = name;
			group.add(object);
		}
	);
};

function getDetailsGroup(dimension) {
	//need a new material, each for each cube...
	var material = new THREE.MeshLambertMaterial({
		color: 0xF000F0
	});
	var cube = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 3), material);

	cube.position.set(dimension.x, 1, dimension.z);
	cube.name = 'detail cube';
	return cube;
}

function createCSS3DTestStuff(state, app, dimension) {
	var content = state.htmlContent;
	var pos = new THREE.Vector3(dimension.x, dimension.y * 2, dimension.z);
	var scaleX = dimension.width / 10.6;
	var scaleY = dimension.depth / 10.6;

	var number = document.createElement('div');
	number.className = 'serverCSS3DLayer';
	number.innerHTML = content;
	var object = new THREE.CSS3DObject(number);
	object.scale.set(scaleX / 40, scaleY / 40, 1);
	object.position.copy(pos);
	object.rotation.x = -90 * math.DegToRad;

	return object;
}

exports.ServerCube.prototype.addSoftware = function(app, options) {
	try{
		//calculte next free field
		var xy = this.layouter.getNext(3, 3);
	} catch(err) {
		console.log(err);
		return;
	}
	//get dimensions of the parent server
	var dim = this.dimension;

	xy.x += dim.x - (dim.width / 2) + 0.5;
	xy.y -= dim.z + (dim.depth / 2) - 0.5;

	//create the cube
	var swCube = new software.SoftwareCube(app, xy);

	this.children.push(swCube);
	console.log('software added to server');
};

exports.ServerCube.prototype.update = function(app) {
	//rotate statesymbol
	if (this.stateSymbol.children[0] !== undefined) {
		this.stateSymbol.children[0].rotation.z += app.deltaTime * 1;
	}

	var objectPos = this.collisionMesh.position;
	var cam = app.mainCamera;

	var distance = new THREE.Vector3()
		.copy(cam.position)
		.sub(objectPos)
		.length();

	if (distance < this.minDistanceForTransparency) {
		var tweenDirection = DIRECTION.IN;
	} else {
		tweenDirection = DIRECTION.OUT;
	}

	//if direction changed and object is visible
	if (this.tweenDirection !== tweenDirection) {
		this.tweenDirection = tweenDirection;

		if (tweenDirection === DIRECTION.IN) {
			//fade in and then show details
			app.scene2D.remove(this.cssObject);
			//remove collision object from octree to get access to the details
			app.octree.remove(this.getCollisionMesh());
			app.octree.update();
			this.setTransparency(app, {
				v: 1
			}, {
				v: 0.2
			}, 250, this.showDetails);
		} else {
			//fade out and then hide details
			this.setTransparency(app, {
				v: 0.2
			}, {
				v: 1
			}, 250, this.hideDetails);
		}
	}
};

exports.ServerCube.prototype.setTransparency = function(
	app, from, to, delay, f) {
	//stores all materials, that are animated due to animation process
	this.opacityAnimatedMaterials = this.collectMaterials();

	//save the material!
	var mats = this.opacityAnimatedMaterials;
	var additionalMats = this.additionalOpacityAnimatedMaterials;
	var dly = delay === undefined ? 500 : delay; //default 500ms delay
	var func = f;
	var cube = this;

	//1sec animation duration
	var tween = new app.tweenEngine.Tween(from).to(to, 1000);
	tween.onUpdate(function() {
		for (var i = 0; i < mats.length; i++) {
			mats[i].opacity = from.v;
		}
		for (i = 0; i < additionalMats.length; i++) {
			additionalMats[i].opacity = from.v;
		}
	});

	tween.delay(dly);
	tween.start();
	tween.easing(app.tweenEngine.Easing.Cubic.InOut);
	tween.onComplete(function() {
		if (func !== undefined) {
			func(app, cube);
		}
	});
};

exports.ServerCube.prototype.hideDetails = function(app, cube) {
		for (var i = 0; i < cube.children.length; i++) {
		var child = cube.children[i];
		if(child instanceof software.SoftwareCube){
			child.hide();
		}
		app.removeObject(child);
	}

	app.scene2D.add(cube.cssObject);

	//add collision object to octree to enable raypicking for this cube
	app.octree.add(cube.getCollisionMesh());
	app.octree.update();
};

exports.ServerCube.prototype.showDetails = function(app, cube) {
	for (var i = 0; i < cube.children.length; i++) {
		var child = cube.children[i];
		if(child instanceof software.SoftwareCube){
			child.show();
		}
		app.addObject(child);
	}
	//do it twice because the image is particulary not inserted at first try
	//happens on fast zoom in/out
	app.scene2D.remove(cube.cssObject);

	//remove collision object from octree to get access to the details
	app.octree.remove(cube.getCollisionMesh());
	app.octree.update();
};

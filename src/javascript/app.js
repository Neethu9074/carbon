'use strict';

var THREE = require('three.js');
var colors = require('./colors');
var mControl = require('./controls/mouseCameraController');
var cube = require('./cube');
var gc = require('./groundSpaceControl2D');
var ground = require('./ground');
var zoom = require('./zoomLevel');
var m = require('./marker');
require('./extensions/OculusRiftEffect');
var rStats = require('./extensions/rStats');
var glStats = require('./extensions/rStats.extras');

exports.Application = function Application() {
	this.container = document.getElementById('GLCanvas');
	this.sceneObjects3D = []; // all objects, added to the 3D scene
	this.collisionObjects = []; //all collision objects for coll-checking
	this.groundControl = new gc.GroundSpaceControl2D(300);
	this.updateObjects = []; //all sceneObjects3D objects, which needs an update

	this.bindListeners();
	this.initializeScene();
	this.createStats();

	//controller
	this.zoomIndex = 2;
	this.zoomLevel = zoom.zoomLevel[this.zoomIndex];
	this.mouseControl = new mControl.MouseControl(this);

	//events
	window.addEventListener('resize', this.onWindowResize, false);
	document.getElementById('newCubeButton').onclick = this.addRandomCube;
	document.getElementById('showWalkableButton').onclick = this.showWalkable;

	this.animate();
};

//direction is 1 or -1, so the zoomIndex will be 0, 1, 2, ..., max array langth
exports.Application.prototype.zoom = function(direction) {
	this.zoomIndex -= direction;
	this.zoomIndex = Math.max(0,
		Math.min(this.zoomIndex, zoom.zoomLevel.length - 1));

	//set the new zoom Level
	this.zoomLevel = zoom.zoomLevel[this.zoomIndex];
};

exports.Application.prototype.addRandomCube = function() {
	var width = Math.ceil(Math.random() * 2);
	var xy = this.groundControl.getNearestFreeField(10 * width);
	if (xy !== undefined) {
		this.addObject(new cube.Cube(xy.x, xy.y, width));
	}
};

exports.Application.prototype.showWalkable = function() {
	for (var i in this.freeFields) {
		var field = this.freeFields[i];
		this.scene.remove(field);
	}
	this.freeFields = [];

	var fields = this.groundControl.getFreeWalkableFields();
	for (i in fields) {
		field = fields[i];
		var marker = new m.Marker(field.x, field.y).getMesh();
		this.scene.add(marker);
		this.freeFields.push(marker);
	}
};

// we need to make sure, that 'this' doesn't get lost.
// we also only want to do this once
exports.Application.prototype.bindListeners = function() {
	this.onWindowResize = this.onWindowResize.bind(this);
	this.calculateDeltaTime = this.calculateDeltaTime.bind(this);
	this.animate = this.animate.bind(this);
	this.render = this.render.bind(this);
	this.addRandomCube = this.addRandomCube.bind(this);
	this.showWalkable = this.showWalkable.bind(this);
};

exports.Application.prototype.initializeScene = function() {
	var width = window.innerWidth;
	var height = window.innerHeight;

	this.time = Date.now();
	this.deltaTime = 0;

	this.setup3DScene(width, height);
};

exports.Application.prototype.clickedOnObject = function(object) {
	//parse object info to infoBox
};

exports.Application.prototype.setup3DScene = function(width, height) {
	this.scene = new THREE.Scene();
	//this.scene.fog = new THREE.Fog(colors.fogColor, 100, 500);

	this.createCamera(width, height);
	this.createLights();

	this.renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	this.renderer.setClearColor(colors.fogColor, 1);
	this.renderer.setSize(width, height);

	//setup occulus rift effect
	this.effect = new THREE.OculusRiftEffect(this.renderer, {
		worldScale: 100
	});
	this.effect.setSize(window.innerWidth, window.innerHeight);


	//add renderer to dom element
	this.container.appendChild(this.renderer.domElement);

	this.addObject(new ground.Ground(this));
};

exports.Application.prototype.addObject = function(obj) {
	//getMesh is defined in superclass SceneObject
	//each object has to set this.setMesh(some mesh or other scene object)
	//to get added to the scene
	var mesh = obj.getMesh();
	var collisionMesh = obj.getCollisionMesh();
	if (collisionMesh !== undefined) {
		this.collisionObjects.push(collisionMesh);
	}
	if (mesh !== undefined) {
		//check whether the objects are inserted into other collections

		//store all objects which needs an update on update
		if (obj.needsUpdate) {
			this.updateObjects.push(obj);
		}
		this.scene.add(mesh);
		this.sceneObjects3D.push(obj);
	}
};

exports.Application.prototype.createLights = function() {
	// add subtle ambient lighting
	var ambientLight = new THREE.AmbientLight(colors.ambientColor);
	this.scene.add(ambientLight);

	//var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	//directionalLight.position.set(100, 100, -100);
	//this.scene.add(directionalLight);
};

exports.Application.prototype.createCamera = function(width, height) {
	//set the farplane as near as possible
	this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 250);
	this.camera.position.set(-2, 5, 2.5);
	this.camera.lookAt(new THREE.Vector3(0, 0, 0));

	if (false) {
		this.camera.position.set(50, 100, -50);
		this.camera.lookAt(new THREE.Vector3(50, 0, -50));
	}
};

exports.Application.prototype.onWindowResize = function() {
	var width = this.container.offsetWidth;
	var height = this.container.offsetHeight;
	var aspect = width / height;
	this.camera.aspect = aspect;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize(width, height);

	this.effect.setSize(width, height);
};

exports.Application.prototype.createStats = function() {
	var glS = new glStats.glStats();
  var tS = new glStats.threeStats(this.renderer);
	var rS = new rStats.rStats({
		values: {
			frame: {
				caption: 'Total frame time (ms)',
				over: 16
			},
			fps: {
				caption: 'Framerate (FPS)',
				below: 30
			},
			calls: {
				caption: 'Calls (three.js)',
				over: 3000
			},
			raf: {
				caption: 'Time since last rAF (ms)'
			},
			rstats: {
				caption: 'rStats update (ms)'
			}
		},
		groups: [{
			caption: 'Framerate',
			values: ['fps', 'raf']
		}, {
			caption: 'Frame Budget',
			values: ['frame', 'texture', 'setup', 'render']
		}],
		fractions: [{
			base: 'frame',
			steps: ['action1', 'render']
		}],
		plugins: [
			tS,
			glS
		]
	});

  this.glStats = glS;
  this.rStats = rS;

	//TODO replace with webpack config
	//this.stats = new Stats();
	//this.stats.domElement.style.position = 'absolute';
	//this.container.appendChild(this.stats.domElement);
};

exports.Application.prototype.render = function() {
	this.renderer.render(this.scene, this.camera);
	//this.effect.render( this.scene, this.camera );
};

exports.Application.prototype.animate = function() {
  var rS = this.rStats;

	rS( 'frame' ).start();
  this.glStats.start();
  rS( 'frame' ).start();
  rS( 'rAF' ).tick();
  rS( 'FPS' ).frame();
  rS( 'updates' ).start();

	//call this again
	requestAnimationFrame(this.animate);

	this.calculateDeltaTime();
	//this.stats.update();

	this.mouseControl.update(this.deltaTime);

	//update all registered objects (don't use for in)
	for (var i = 0; i < this.updateObjects.length; i++) {
		this.updateObjects[i].update(this.deltaTime);
	}

	//update LOD objects
	var cam = this.camera;
	this.scene.updateMatrixWorld();
	this.scene.traverse(function(object) {
		if (object instanceof THREE.LOD) {
			object.update(cam);
		}
	});

  rS( 'updates' ).end();
  rS( 'render' ).start();

  //Perform render
	//render the scene when all animations are updated
	this.render();

  rS( 'render' ).end();
  rS( 'frame' ).end();
  rS().update();
};

exports.Application.prototype.calculateDeltaTime = function() {
	var timeNow = Date.now();
	this.deltaTime = (timeNow - this.time) / 1000;
	this.time = timeNow;
};

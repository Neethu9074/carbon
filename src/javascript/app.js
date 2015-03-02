'use strict';

var THREE = require('three.js');
var colors = require('./colors');
var server = require('./serverCube');
var layouter = require('./layouter2D');
var ground = require('./ground');
var dS = require('./detailStates');
var server = require('./serverCube');
var software = require('./softwareCube');

//controls
var mControl = require('./controls/mouseCameraController');

//effects
var particles = require('./effects/risingParticles');

//extensions
require('./extensions/CSS3DRenderer');
require('./extensions/OculusRiftEffect');
require('./extensions/Octree');
var TWEEN = require('./extensions/tween.min.js');
var rStats = require('./extensions/rStats');
var glStats = require('./extensions/rStats.extras');


exports.Application = function Application() {
	this.canvas = document.getElementById('WebGL');
	this.sceneObjects3D = []; // all objects, added to the 3D scene
	this.sceneObjects2D = []; // all objects, added to the 2D CSS scene
	this.layouter = new layouter.Layouter2D(50, 50);
	this.updateableObjects = []; //all objects needing an update every frame

	this.bindListeners();
	this.initialize();
	this.createStats();
	this.createOctree();
	this.tweenEngine = TWEEN;
	this.clickedObj = undefined;

	this.mouseControl = new mControl.MouseControl(this);

	//zoom detail Level
	this.midDetailsDistance = 25;
	this.maxDetailsDistance = 10;
  this.zoomLevel = this.mouseControl.zoomLevel;
  this.detailState = dS.DETAILSTATE.MIN;

	//events
	window.addEventListener('resize', this.onWindowResize, false);
	document.getElementById('newCubeButton').onclick = this.addRandomCube;
	document.getElementById('destroyCubeButton').onclick = this.removeCube;
	document.getElementById('showWalkableButton').onclick = this.showWalkable;

	this.animate();
};

// we need to make sure, that 'this' doesn't get lost.
// we also only want to do this once
exports.Application.prototype.bindListeners = function() {
	this.onWindowResize = this.onWindowResize.bind(this);
	this.calculateDeltaTime = this.calculateDeltaTime.bind(this);
	this.animate = this.animate.bind(this);
	this.render = this.render.bind(this);
	this.addRandomCube = this.addRandomCube.bind(this);
	this.removeCube = this.removeCube.bind(this);
	this.showWalkable = this.showWalkable.bind(this);
};

//direction is 1 or -1, so the zoomIndex will be 0, 1, 2, ..., max array langth
exports.Application.prototype.zoom = function(zoomLevel) {
  this.zoomLevel = zoomLevel;

	//report to registered zoom cubes
  var state = dS.DETAILSTATE.MIN;
  if(zoomLevel < this.midDetailsDistance) {
    state = dS.DETAILSTATE.MID;
    if(zoomLevel < this.maxDetailsDistance) {
      state = dS.DETAILSTATE.MAX;
    }
  }
  //if state changed
  if(state !== this.detailState) {
    this.detailState = state;
  }
};

exports.Application.prototype.addRandomCube = function() {
	var width = Math.ceil(Math.random() * 2);
	var xy = this.layouter.getNext(width, width);
	if (xy !== undefined) {
		var cube = new server.ServerCube(this, xy.x, xy.y, width, width);
		this.addObject(cube);
	}
};

exports.Application.prototype.removeCube = function() {
	var cube = this.clickedObj;
	if(cube !== undefined){
		if(cube instanceof server.ServerCube ||
			cube instanceof software.SoftwareCube) {
			this.removeObject(cube);
		}
	}
};

exports.Application.prototype.showWalkable = function() {
	var geo = new THREE.Geometry();
	var fields = this.layouter.getFreeWalkable();
	for (var i in fields) {
		var field = fields[i];
		geo.vertices.push(new THREE.Vector3(field.x, 3.1, -field.y));
	}
	var mat = new THREE.PointCloudMaterial({
		color: 0x00D66B,
		size: 1
	});

	var sys = new THREE.PointCloud(geo, mat);
	this.scene.add(sys);
};

exports.Application.prototype.initialize = function() {
	var width = window.innerWidth;
	var height = window.innerHeight;

	this.time = Date.now();
	this.deltaTime = 0;
	this.timeSinceStarted = 0;

	this.createRenderer(width, height);
	this.setup3DScene(width, height);
	this.setup2DScene();
	this.setupEffects();
};

exports.Application.prototype.clickedOnObject = function(object) {
	this.clickedObj = object.parentCube;
	console.log('clicked on obj:', object);
	//parse object info to infoBox
};

exports.Application.prototype.setup3DScene = function(width, height) {
	this.scene = new THREE.Scene();
	//this.scene.fog = new THREE.Fog(colors.fogColor, 100, 500);

	this.createCamera(width, height);
	this.createLights();

	//setup occulus rift effect
	this.oculusEffectMain = new THREE.OculusRiftEffect(this.mainRenderer, {
		worldScale: 1
	});
	this.oculusEffectMain.setSize(window.innerWidth, window.innerHeight);

	//add the ground
	this.addObject(new ground.Ground(this));
};

exports.Application.prototype.setup2DScene = function() {
	this.scene2D = new THREE.Scene();
};

exports.Application.prototype.createRenderer = function(width, height) {
	this.mainRenderer = new THREE.WebGLRenderer({
		antialias: true
	});
	this.mainRenderer.setClearColor(colors.fogColor, 1);
	this.mainRenderer.setSize(width, height);

	//add mainRenderer to dom element
	this.canvas.appendChild(this.mainRenderer.domElement);

	//3D CSS
	this.cssRenderer = new THREE.CSS3DRenderer();
	this.cssRenderer.setSize(width, height);
	document.getElementById('GLCanvasOverlay')
		.appendChild(this.cssRenderer.domElement);
};

exports.Application.prototype.setupEffects = function() {
	var positions = [];

	for (var x = 0; x < 300; x += 15) {
		for (var y = 0; y < 300; y += 15) {
			positions.push([x, y]);
		}
	}

	var effect = new particles.RisingParticles(this, positions);
	this.addObject(effect);
};

exports.Application.prototype.addObject = function(obj) {
	//getMesh is defined in superclass SceneObject
	//each object has to set this.setMesh(some mesh or other scene object)
	//to get added to the scene
	var mesh = obj.getMesh();
	var collisionMesh = obj.getCollisionMesh();
	if (collisionMesh !== undefined) {
		this.octree.add(collisionMesh, {
			useFaces: false
		});
		this.octree.update();
	}
	if (mesh !== undefined) {
		//check whether the objects are inserted into other collections
		this.scene.add(mesh);
		this.sceneObjects3D.push(obj);
	}
	//store all objects which needs an update on update
	if (obj.needsUpdate) {
		this.updateableObjects.push(obj);
	}
};

exports.Application.prototype.removeObject = function(obj) {
	//getMesh is defined in superclass SceneObject
	//each object has to set this.setMesh(some mesh or other scene object)
	//to get added to the scene
	var collisionMesh = obj.getCollisionMesh();
	if (collisionMesh !== undefined) {
		this.octree.remove(collisionMesh, {
			useFaces: false
		});
		this.octree.update();
	}

	//store all objects which needs an update on update
	if (obj.needsUpdate) {
		this.updateableObjects = this.updateableObjects.filter(item => item !== obj);
	}
	this.sceneObjects3D = this.sceneObjects3D.filter(item => item !== obj);

	if(obj instanceof server.ServerCube || obj  instanceof software.SoftwareCube){
		obj.destroy();
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
	this.mainCamera = new THREE.PerspectiveCamera(60, width / height, 1, 1250);
	this.mainCamera.position.set(-2, 5, 2.5);
	this.mainCamera.lookAt(new THREE.Vector3(0, 0, 0));

	//set true for debug purpose
	if (false) {
		this.mainCamera.position.set(50, 100, -50);
		this.mainCamera.lookAt(new THREE.Vector3(50, 0, -50));
	}
};

exports.Application.prototype.onWindowResize = function() {
	var width = this.canvas.offsetWidth;
	var height = this.canvas.offsetHeight;
	var aspect = width / height;
	this.mainCamera.aspect = aspect;
	this.mainCamera.updateProjectionMatrix();

	this.mainRenderer.setSize(width, height);
	this.cssRenderer.setSize(width, height);

	this.oculusEffectMain.setSize(width, height);
};

exports.Application.prototype.createStats = function() {
	var glS = new glStats.glStats();
	var tS = new glStats.threeStats(this.mainRenderer);
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
		plugins: [
			tS,
			glS
		]
	});

	this.glStats = glS;
	this.rStats = rS;
};

exports.Application.prototype.createOctree = function() {
	//setup octree
	this.octree = new THREE.Octree({
		// uncomment below to see the octree (may kill the fps)
		//scene: this.scene,
		// when undeferred = true, objects are inserted immediately
		// instead of being deferred until next octree.update() call
		// this may decrease performance as it forces a matrix update
		undeferred: true,
		// set the max depth of tree
		depthMax: Infinity,
		// max number of objects before nodes split or merge
		objectsThreshold: 8,
		// percent between 0 and 1 that nodes will overlap each other
		// helps insert objects that lie over more than one node
		overlapPct: 0
	});
};

exports.Application.prototype.findObject = function(raycaster) {
	//search all candidates where ray cutting quadrants of the octree
	var octreeObjects = this.octree.search(
		raycaster.ray.origin,
		raycaster.ray.far,
		true, //true -> organized by objects
		raycaster.ray.direction);

	var intersections = raycaster.intersectOctreeObjects(octreeObjects);
	if (intersections.length > 0) {
		return intersections[0].object; //first hit
	}
	return undefined;
};

exports.Application.prototype.render = function() {
	this.mainRenderer.render(this.scene, this.mainCamera);
	this.cssRenderer.render(this.scene2D, this.mainCamera);
	//this.oculusEffectMain.render( this.scene, this.mainCamera );
};

exports.Application.prototype.animate = function() {

	var rS = this.rStats;

	rS('frame').start();
	this.glStats.start();
	rS('frame').start();
	rS('rAF').tick();
	rS('FPS').frame();
	rS('updates').start();

	//call this again
	requestAnimationFrame(this.animate);
	//calculate time the last frame needed to be updated/rendered
	this.calculateDeltaTime();

	//update the controls
	this.mouseControl.update(this.deltaTime);

	TWEEN.update();

	server.update(this);

	//update all registered objects (don't use for in)
	for (var i = 0; i < this.updateableObjects.length; i++) {
		this.updateableObjects[i].update();
	}

	//update LOD objects
	var cam = this.mainCamera;
	this.scene.traverse(function(object) {
		if (object instanceof THREE.LOD) {
			object.update(cam);
		}
	});

	rS('updates').end();
	rS('render').start();

	//Perform render
	//render the scene when all animations are updated
	this.render();

	rS('render').end();
	rS('frame').end();
	rS().update();

};

exports.Application.prototype.calculateDeltaTime = function() {
	var timeNow = Date.now();
	this.deltaTime = (timeNow - this.time) / 1000; //in ms
	this.time = timeNow;
	this.timeSinceStarted += this.deltaTime;
};
